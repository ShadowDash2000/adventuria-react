export const pbCollections = {
    players: 'players',
    playersProgress: 'players_progress',
    playerStats: 'player_stats',
    actions: 'actions',
    activities: 'activities',
    companies: 'companies',
    platforms: 'platforms',
    genres: 'genres',
    tags: 'tags',
    themes: 'themes',
    gameTypes: 'game_types',
    activityFilter: 'activity_filter',
    activitiesPlatforms: 'activities_platforms',
    activitiesDevelopers: 'activities_developers',
    activitiesPublishers: 'activities_publishers',
    activitiesGenres: 'activities_genres',
    activitiesTags: 'activities_tags',
    activitiesThemes: 'activities_themes',
    cells: 'cells',
    items: 'items',
    effects: 'effects',
    inventory: 'inventory',
    settings: 'settings',
    rules: 'rules',
    audioPresets: 'audio_presets',
    audio: 'audio',
    worlds: 'worlds',
    cellEventsSchedule: 'cell_events_schedule',
    seasons: 'seasons',
};

export const playerSchema = {
    id: 'id',
    name: 'name',
    avatar: 'avatar',
    color: 'color',
    twitch: 'twitch',
    youTube: 'youtube',
    youTubeChannelId: 'youtube_channel_id',
    isStreamLive: 'is_stream_live',
};

export const playerProgressSchema = {
    id: 'id',
    player: 'player',
    season: 'season',
    currentWorld: 'current_world',
    canMove: 'can_move',
    points: 'points',
    balance: 'balance',
    energy: 'energy',
    cellsPassed: 'cells_passed',
    isInJail: 'is_in_jail',
    dropsInARow: 'drops_in_a_row',
    itemWheelsCount: 'item_wheels_count',
    maxInventorySlots: 'max_inventory_slots',
    stats: 'stats',
};

export const playerStatsSchema = {
    id: 'id',
    player: 'player',
    season: 'season',
    drops: 'drops',
    rerolls: 'rerolls',
    wasInJail: 'was_in_jail',
    itemsUsed: 'items_used',
    diceRolls: 'dice_rolls',
    maxDiceRoll: 'max_dice_roll',
    wheelsRolled: 'wheels_rolled',
};

export const actionSchema = {
    id: 'id',
    player: 'player',
    cell: 'cell',
    status: 'status',
    activity: 'activity',
    review: 'review',
    cellsPassed: 'cells_passed',
    itemsList: 'items_list',
    usedItems: 'used_items',
    customActivityFilter: 'custom_activity_filter',
};

export const activitySchema = {
    id: 'id',
    idDb: 'id_db',
    type: 'type',
    name: 'name',
    slug: 'slug',
    releaseDate: 'release_date',
    platforms: 'platforms',
    developers: 'developers',
    publishers: 'publishers',
    genres: 'genres',
    tags: 'tags',
    themes: 'themes',
    gameType: 'game_type',
    steamAppId: 'steam_app_id',
    steamAppPrice: 'steam_app_price',
    hltbId: 'hltb_id',
    hltbCampaignTime: 'hltb_campaign_time',
    cover: 'cover',
    coverAlt: 'cover_alt',
    checksum: 'checksum',
};

export const inventorySchema = {
    id: 'id',
    activated: 'activated',
    player: 'player',
    item: 'item',
    isActive: 'is_active',
    appliedEffects: 'applied_effects',
};

export const itemSchema = {
    id: 'id',
    disabled: 'disabled',
    name: 'name',
    icon: 'icon',
    effects: 'effects',
    order: 'order',
    isUsingSlot: 'is_using_slot',
    isActiveByDefault: 'is_active_by_default',
    canDrop: 'can_drop',
    isRollable: 'is_rollable',
    description: 'description',
    type: 'type',
    price: 'price',
};

export const cellSchema = {
    id: 'id',
    disabled: 'disabled',
    sort: 'sort',
    type: 'type',
    world: 'world',
    filter: 'filter',
    audioPreset: 'audio_preset',
    icon: 'icon',
    name: 'name',
    points: 'points',
    energyConsume: 'energy_consume',
    coins: 'coins',
    description: 'description',
    color: 'color',
    cantDrop: 'cant_drop',
    cantReroll: 'cant_reroll',
    isSafeDrop: 'is_safe_drop',
    isCustomFilterNotAllowed: 'is_custom_filter_not_allowed',
    isChangeGameNotAllowed: 'is_change_game_not_allowed',
    value: 'value',
};

export const genresSchema = { id: 'id', idDb: 'id_db', name: 'name', checksum: 'checksum' };

export const activityFilterSchema = {
    id: 'id',
    type: 'type',
    name: 'name',
    platforms: 'platforms',
    platformsStrict: 'platforms_strict',
    game_types: 'game_types',
    developers: 'developers',
    publishers: 'publishers',
    genres: 'genres',
    tags: 'tags',
    themes: 'themes',
    minPrice: 'min_price',
    maxPrice: 'max_price',
    releaseDateFrom: 'release_date_from',
    releaseDateTo: 'release_date_to',
    minCampaignTime: 'min_campaign_time',
    maxCampaignTime: 'max_campaign_time',
    activities: 'activities',
};

export const audioPresetSchema = { id: 'id', name: 'name', slug: 'slug', audio: 'audio' };

export const audioSchema = { id: 'id', name: 'name', audio: 'audio', duration: 'duration' };

export const worldSchema = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    sort: 'sort',
    isLoop: 'is_loop',
    isDefaultWorld: 'is_default_world',
    transitionToWorld: 'transition_to_world',
    effects: 'effects',
};

export const seasonsSchema = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    seasonDateStart: 'season_date_start',
    seasonDateEnd: 'season_date_end',
};
