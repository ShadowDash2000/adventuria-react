export const pbCollections = {
    players: 'players',
    playersProgress: 'players_progress',
    actions: 'actions',
    activities: 'activities',
    companies: 'companies',
    platforms: 'platforms',
    genres: 'genres',
    tags: 'tags',
    themes: 'themes',
    gameTypes: 'game_types',
    activityFilter: 'activity_filter',
    howLongToBeat: 'howlongtobeat',
    steamSpy: 'steam_spy',
    cheapshark: 'cheapshark',
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

export const actionSchema = {
    id: 'id',
    player: 'player',
    cell: 'cell',
    type: 'type',
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

export const howLongToBeatSchema = {
    id: 'id',
    idDb: 'id_db',
    name: 'name',
    year: 'year',
    campaign: 'campaign',
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

export const settingsSchema = {
    eventEnded: 'event_ended',
    eventStartDate: 'event_start_date',
    currentWeek: 'current_week',
    blockAllActions: 'block_all_actions',
    pointsForDrop: 'points_for_drop',
    dropsToJail: 'drops_to_jail',
    igdbGamesParsed: 'igdb_games_parsed',
    disableIgdbParser: 'disable_igdb_parser',
    disableSteamParser: 'disable_steam_parser',
    disableCheapsharkParser: 'disable_cheapshark_parser',
    disableHltbParser: 'disable_hltb_parser',
    disableRefreshHltbTime: 'disable_refresh_hltb_time',
    killParser: 'kill_parser',
    igdbForceUpdateGames: 'igdb_force_update_games',
};

export const activitiesPlatformsSchema = { id: 'id', activity: 'activity', platform: 'platform' };

export const activitiesDevelopersSchema = {
    id: 'id',
    activity: 'activity',
    developer: 'developer',
};

export const activitiesPublishersSchema = {
    id: 'id',
    activity: 'activity',
    publisher: 'publisher',
};

export const activitiesGenresSchema = { id: 'id', activity: 'activity', genre: 'genre' };

export const activitiesTagsSchema = { id: 'id', activity: 'activity', tag: 'tag' };

export const activitiesThemesSchema = { id: 'id', activity: 'activity', theme: 'theme' };

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
