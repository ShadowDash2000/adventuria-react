import {Box, Flex, Text, VStack} from "@chakra-ui/react";
import {Button} from "@ui/button";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";

export type WheelItem = {
    key: string;
    image: string; // URL to image
    title: string;
};

export type WheelOFortuneHandle = {
    spin: (opts?: {
        targetKey?: string;
        durationMs?: number;
        spins?: number;
    }) => Promise<number>;
    replaceItems: (items: WheelItem[]) => void;
    getItems: () => WheelItem[];
    getCurrentIndex: () => number;
};

type WheelOFortuneProps = {
    items?: WheelItem[];
    onFinish?: (index: number, item: WheelItem) => void;
};

export const WheelOFortune = forwardRef<WheelOFortuneHandle, WheelOFortuneProps>(
    (
        {items: initialItems, onFinish},
        ref,
    ) => {
        const [items, setItems] = useState<WheelItem[]>(
            initialItems && initialItems.length > 1
                ? initialItems
                : Array.from({length: 8}, (_, i) => ({
                    key: String(i + 1),
                    title: String(i + 1),
                    image: '',
                }))
        );

        // Canvas and drawing
        const canvasRef = useRef<HTMLCanvasElement | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);
        const [rotation, setRotation] = useState<number>(0); // radians, clockwise positive
        const [spinning, setSpinning] = useState<boolean>(false);
        const [currentIndex, setCurrentIndex] = useState<number>(0);
        const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);

        // Colors for fallback fills
        const colors = ["#fbd38d", "#fc8181", "#90cdf4", "#9ae6b4", "#fbb6ce", "#b2f5ea", "#c3dafe", "#f6ad55"];

        // Geometry helpers
        const segAngle = items.length > 0 ? (Math.PI * 2) / items.length : Math.PI * 2;

        const computeCurrentIndex = useCallback(
            (rot: number) => {
                if (items.length === 0) return 0;
                const rel = normalize(-rot); // see derivation in analysis
                return Math.floor(rel / segAngle) % items.length;
            },
            [items.length, segAngle]
        );

        // Simple image cache
        const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

        // Draw function must be defined before any effects that use it
        const draw = useCallback(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;
            const r = Math.min(w, h) / 2 - 6; // padding

            // draw wheel segments
            const baseStart = -Math.PI / 2 + rotation; // segment 0 starts at top

            for (let i = 0; i < items.length; i++) {
                const start = baseStart + i * segAngle;
                const end = start + segAngle;
                const mid = start + segAngle / 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, start, end);
                ctx.closePath();
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();

                // Draw image clipped to the wedge (if provided)
                const imgUrl = items[i]?.image;
                let img: HTMLImageElement | undefined;
                if (imgUrl) {
                    img = imageCache.current.get(imgUrl);
                    if (!img) {
                        img = new Image();
                        img.crossOrigin = "anonymous";
                        img.onload = () => {
                            // redraw when loaded
                            const raf = requestAnimationFrame(() => draw());
                        };
                        img.onerror = () => {
                            const raf = requestAnimationFrame(() => draw());
                        };
                        img.src = imgUrl;
                        imageCache.current.set(imgUrl, img);
                    }
                }
                if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                    ctx.save();
                    // Clip strictly to the current wedge
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.arc(cx, cy, r, start, end);
                    ctx.closePath();
                    ctx.clip();

                    // Draw the image fitted inside the wedge (not the whole wheel).
                    // Local coordinates: origin at center, local Y points along the wedge centerline (radially outward),
                    // so the TOP of the image (y=0 in image space) is near the wheel center as requested.
                    ctx.translate(cx, cy);
                    ctx.rotate(mid - Math.PI / 2);

                    const rectHeight = r; // radial extent
                    const rectWidth = Math.max(1, 2 * r * Math.sin(segAngle / 2)); // tangential width at outer edge

                    // Cover strategy within this rectangle to preserve aspect ratio
                    const scale = Math.max(rectWidth / img.naturalWidth, rectHeight / img.naturalHeight);
                    const dw = img.naturalWidth * scale;
                    const dh = img.naturalHeight * scale;

                    // Center horizontally across the wedge, top at the center (towards wheel center)
                    const dx = -dw / 2;
                    const dy = 0;
                    ctx.drawImage(img, dx, dy, dw, dh);

                    ctx.restore();
                }

                // Separator line
                ctx.strokeStyle = "rgba(0,0,0,0.15)";
                ctx.lineWidth = Math.max(1, r * 0.008);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(start) * r, cy + Math.sin(start) * r);
                ctx.stroke();
            }

            // Outer ring
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(0,0,0,0.25)";
            ctx.lineWidth = Math.max(2, r * 0.02);
            ctx.stroke();
        }, [items, rotation, segAngle]);

        // Canvas sizing helper: avoid writing 0px on first paint; retry on next frame
        const updateCanvasSize = useCallback(() => {
            const canvas = canvasRef.current;
            const wrap = containerRef.current;
            if (!canvas || !wrap) return false;
            const rect = wrap.getBoundingClientRect();
            const size = Math.min(rect.width, rect.height);
            const dpr = window.devicePixelRatio || 1;
            const pixel = Math.floor(size * dpr);
            if (canvas.width !== pixel) canvas.width = pixel;
            if (canvas.height !== pixel) canvas.height = pixel;
            // Only set CSS sizes when we have a real size; otherwise preserve previous CSS
            const css = Math.floor(size);
            if (canvas.style.width !== `${css}px`) canvas.style.width = `${css}px`;
            if (canvas.style.height !== `${css}px`) canvas.style.height = `${css}px`;
            return true;
        }, []);

        // Resize observer to keep canvas crisp — attach on mount
        useEffect(() => {
            const wrap = containerRef.current;
            if (!wrap) return;

            // Initial measure (in case ResizeObserver fires later)
            if (!updateCanvasSize()) {
                // Retry on next frame if size was 0
                const raf = requestAnimationFrame(() => {
                    updateCanvasSize();
                    draw();
                });
                return () => cancelAnimationFrame(raf);
            }
            draw();

            const ro = new ResizeObserver(() => {
                if (updateCanvasSize()) {
                    draw();
                }
            });
            ro.observe(wrap);
            return () => ro.disconnect();
        }, [updateCanvasSize, draw]);


        useEffect(() => {
            setCurrentIndex(computeCurrentIndex(rotation));
        }, [rotation, computeCurrentIndex]);

        // Redraw when dependencies change
        useEffect(() => {
            draw();
        }, [draw]);

        // Clear hover tooltip during spinning to avoid jitter
        useEffect(() => {
            if (spinning) setHover(null);
        }, [spinning]);

        // Spin animation
        const rafRef = useRef<number | null>(null);

        const stopAnimation = () => {
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };

        useEffect(() => () => stopAnimation(), []);

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        const spin = useCallback(
            (opts?: { targetKey?: string; durationMs?: number; spins?: number }) => {
                if (items.length === 0) return Promise.resolve(0);
                const duration = Math.max(600, opts?.durationMs ?? 4000);
                const fullSpins = Math.max(2, opts?.spins ?? 6);
                const start = performance.now();
                const startRot = rotation;
                let targetIdx: number | undefined;
                if (opts?.targetKey != null) {
                    const byKey = items.findIndex((it) => it.key === opts.targetKey);
                    if (byKey >= 0) targetIdx = byKey;
                }
                if (targetIdx == null) {
                    targetIdx = Math.floor(Math.random() * items.length);
                }

                // Aim not strictly at the exact center of the winning segment.
                // Add a small random offset within the segment, staying away from edges.
                const edgeMargin = Math.min(segAngle * 0.2, (5 * Math.PI) / 180); // <= 5° or 20% of segment
                const maxOffset = Math.max(0, Math.min(segAngle * 0.35, segAngle / 2 - edgeMargin));
                const randomOffset = (Math.random() * 2 - 1) * maxOffset; // symmetric around center
                const targetRelative = targetIdx * segAngle + segAngle / 2 + randomOffset;
                const endRot = -(targetRelative + fullSpins * Math.PI * 2);

                setSpinning(true);

                return new Promise<number>((resolve) => {
                    const tick = (now: number) => {
                        const t = Math.min(1, (now - start) / duration);
                        const eased = easeOutCubic(t);
                        const value = startRot + (endRot - startRot) * eased;
                        setRotation(value);
                        // index is derived by effect
                        if (t < 1) {
                            rafRef.current = requestAnimationFrame(tick);
                        } else {
                            setSpinning(false);
                            const idx = computeCurrentIndex(value);
                            setCurrentIndex(idx);
                            resolve(idx);
                            onFinish?.(idx, items[idx]);
                        }
                    };
                    rafRef.current = requestAnimationFrame(tick);
                });
            },
            [items, rotation, segAngle, computeCurrentIndex, onFinish]
        );

        // Expose imperative API
        useImperativeHandle(
            ref,
            () => ({
                spin,
                replaceItems: (newItems: WheelItem[]) => {
                    setItems(newItems && newItems.length > 0 ? newItems : []);
                    // reset rotation to align to first item on top
                    setRotation(0);
                },
                getItems: () => items.slice(),
                getCurrentIndex: () => currentIndex,
            }),
            [spin, items, currentIndex]
        );

        // Sync with prop changes
        useEffect(() => {
            if (initialItems && initialItems.length > 0) {
                setItems(initialItems);
            }
        }, [JSON.stringify(initialItems)]);

        const headerText = items.length > 0 ? items[currentIndex]?.title ?? "" : "—";

        return (
            <Flex align="center" justify="center">
                <VStack gap="6" w="full" h="full">
                    <Text fontSize="2xl" fontWeight="bold" color="white.800">
                        {headerText}
                    </Text>
                    <Box
                        ref={containerRef}
                        position="relative"
                        w={{base: "90vw", md: "70vh"}}
                        h={{base: "90vw", md: "70vh"}}
                        maxW="min(90vw, 80vh)"
                        maxH="min(90vw, 80vh)"
                        rounded="full"
                        overflow="visible"
                        onMouseMove={(e) => {
                            if (!containerRef.current || items.length === 0 || spinning) return;
                            const rect = containerRef.current.getBoundingClientRect();
                            const localX = e.clientX - rect.left;
                            const localY = e.clientY - rect.top;
                            const cx = rect.width / 2;
                            const cy = rect.height / 2;
                            const dx = localX - cx;
                            const dy = localY - cy;
                            const dist = Math.hypot(dx, dy);
                            const rCss = Math.min(rect.width, rect.height) / 2 - 6;
                            if (dist <= 0 || dist > rCss) {
                                if (hover) setHover(null);
                                return;
                            }
                            const angle = Math.atan2(dy, dx);
                            const baseStart = -Math.PI / 2 + rotation;
                            const rel = normalize(angle - baseStart);
                            let idx = Math.floor(rel / segAngle);
                            if (idx < 0) idx = 0;
                            if (idx >= items.length) idx = items.length - 1;
                            setHover({index: idx, x: localX, y: localY});
                        }}
                        onMouseLeave={() => setHover(null)}
                    >
                        {/* Canvas Wheel */}
                        <Box
                            as="canvas"
                            ref={canvasRef}
                            position="absolute"
                            inset={0}
                            display="block"
                            rounded="full"
                        />
                        {/* Pointer */}
                        <Box
                            position="absolute"
                            left="50%"
                            top="-8px"
                            transform="translateX(-50%) rotate(180deg)"
                            width="0"
                            height="0"
                            borderLeft="10px solid transparent"
                            borderRight="10px solid transparent"
                            borderBottom="20px solid"
                            borderBottomColor="red.500"
                            filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
                        />
                        {/* Hover tooltip with item title */}
                        {hover && !spinning && items[hover.index] && (
                            <Box
                                position="absolute"
                                left={`${hover.x}px`}
                                top={`${hover.y}px`}
                                transform="translate(12px, -50%)"
                                pointerEvents="none"
                                bg="blackAlpha.800"
                                color="white"
                                px="2"
                                py="1"
                                rounded="md"
                                fontSize="sm"
                                boxShadow="md"
                                maxW="60%"
                                whiteSpace="nowrap"
                                textOverflow="ellipsis"
                                overflow="hidden"
                            >
                                {items[hover.index].title}
                            </Box>
                        )}
                    </Box>

                    <Flex gap="3">
                        <Button disabled={spinning} onClick={() => spin()}>
                            Крутить
                        </Button>
                        <Button variant="subtle" onClick={() => setRotation(0)} disabled={spinning}>
                            Сбросить
                        </Button>
                    </Flex>
                </VStack>
            </Flex>
        );
    }
);

const normalize = (a: number) => {
    const twoPi = Math.PI * 2;
    a = a % twoPi;
    if (a < 0) a += twoPi;
    return a;
}