import { Heading, Image, VStack, Text, Grid, GridItem } from '@chakra-ui/react';
import { Flex } from '@theme/flex';
import { Avatar } from '@components/Avatar';
import { VideoAutoplay } from '@ui/video-autoplay';
import KiryuGif from '@public/kiryu.gif';
import ShadodImage from '@public/developers/shadod.jpg';
import AtsImage from '@public/developers/jeffrey.png';
import MboImage from '@public/developers/coi.jpeg';
import ShadodPushUpsGif from '@public/developers/shadod-push-ups.gif';
import StrandedDeepVideo from '@public/developers/stranded-deep.mp4';
import AtsDropVideo from '@public/developers/ats-drop.mp4';
import PopiyaKalVideo from '@public/developers/popiya-kal.mp4';
import FiveMinutesAgoVideo from '@public/developers/five-minutes-ago.mp4';
import NihuyaTutPopiyaVideo from '@public/developers/nihuya-tut-popiya.mp4';
import PopiyaClubVideo from '@public/developers/popiya-club.mp4';
import ShadodPolicemanVideo from '@public/developers/shadod-policeman.mp4';
import PopiyaFightClubVideo from '@public/developers/popiya-fight-club.mp4';
import PapaSchrodaPrivVideo from '@public/developers/papa-schroda-priv.mp4';
import NasralPopiyaVideo from '@public/developers/nasral-popiya.mp4';
import SchrodDiplomVideo from '@public/developers/schrod-diplom.webm';

const Developers = () => {
    return (
        <Flex
            variant="solid"
            w="80vw"
            py={6}
            justify="center"
            align="center"
            flexDir="column"
            gap={6}
        >
            <Heading size="3xl" as="h1">
                Создатели
            </Heading>
            <VStack>
                <Image src={KiryuGif} />
                <Heading
                    as="h2"
                    css={{
                        animation: 'rainbow',
                        bg: 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff, #ff0000)',
                        bgClip: 'text',
                        backgroundSize: '200% auto',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Приключпопия 3!
                </Heading>
            </VStack>
            <Grid templateColumns="repeat(2, 1fr)" gapY={4} w="50%" justifyContent="space-around">
                <GridItem display="flex" flexDir="column" alignItems="center" gap={2}>
                    <Avatar src={ShadodImage} outlineColor="#39fc03" w={24} h={24} />
                    <Text fontSize="xl">shadod</Text>
                    <Text color="fg.muted" textAlign="center">
                        Backend, frontend
                    </Text>
                </GridItem>
                <GridItem display="flex" flexDir="column" alignItems="center" gap={2}>
                    <Avatar src={AtsImage} outlineColor="#323ca8" w={24} h={24} />
                    <Text fontSize="xl">ArcherTenSixteen</Text>
                    <Text color="fg.muted" textAlign="center">
                        Дизайн поля, клеток и предметов. Генерация треков для Радиопопии.
                    </Text>
                </GridItem>
                <GridItem display="flex" flexDir="column" alignItems="center" gap={2} colSpan={2}>
                    <Avatar src={MboImage} outlineColor="#007324" w={24} h={24} />
                    <Text fontSize="xl">Мистер Большое Очко</Text>
                    <Text color="fg.muted" textAlign="center">
                        Frontend
                    </Text>
                </GridItem>
            </Grid>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} w="50%" justifyContent="space-around">
                <GridItem>
                    <Image src={ShadodPushUpsGif} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={StrandedDeepVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={AtsDropVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={PopiyaKalVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={FiveMinutesAgoVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={NihuyaTutPopiyaVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={PopiyaClubVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={ShadodPolicemanVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={PopiyaFightClubVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w={64} src={PapaSchrodaPrivVideo} />
                </GridItem>
                <GridItem colSpan={2}>
                    <VideoAutoplay w="full" h="full" src={NasralPopiyaVideo} />
                </GridItem>
                <GridItem>
                    <VideoAutoplay w="full" h="full" src={SchrodDiplomVideo} />
                </GridItem>
            </Grid>
        </Flex>
    );
};

export default Developers;
