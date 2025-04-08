type LinkType = {
  href: string
  templated: boolean
}

export type LocationType = {
  longitude: string
  latitude: string
}

type PromoterType = {
  id: string
  name: string
  description: string
}

type LocalTimeType = {
  chronology: {
    zone: {
      fixed: boolean
      id: string
    }
  }
  millisOfSecond: number
  millisOfDay: number
  secondOfMinute: number
  minuteOfHour: number
  hourOfDay: number
  values: [
    {
      type: number
      format: number
    },
  ]
  fieldTypes: [
    {
      durationType: {
        name: string
      }
      rangeDurationType: {
        name: string
      }
      name: string
    },
  ]
  fields: [
    {
      lenient: boolean
      rangeDurationField: DurationFieldType
      leapDurationField: DurationFieldType
      durationField: DurationFieldType
      minimumValue: number
      maximumValue: number
      name: string
      type: {
        durationType: {
          name: string
        }
        rangeDurationType: {
          name: string
        }
        name: string
      }
      supported: boolean
    },
  ]
}

type _selfLinkType = {
  self: LinkType
}

type DurationFieldType = {
  precise: boolean
  unitMillis: number
  name: string
  type: {
    name: string
  }
  supported: boolean
}

export type ImageType = {
  url: string
  ratio: string
  width: number
  height: number
  fallback: boolean
  attribution: string
}

type IDNameLocaleType = {
  id: string
  name: string
  locale: string
}

type GenresAttractionType = {
  subGenres: IDNameLocaleType[]
  id: string
  name: string
  locale: string
}

type ClassificationsTypes = {
  subTypes: IDNameLocaleType[]
  id: string
  name: string
  locale: string
}

type ClassificationsSegmentAttraction = {
  genres: GenresAttractionType[]
  id: string
  name: string
  locale: string
}

type ClassificationsAttractionType = {
  primary: boolean
  segment: ClassificationsSegmentAttraction
  genre: IDNameLocaleType
  subGenre: IDNameLocaleType
  type: ClassificationsTypes
  subType: IDNameLocaleType
  family: boolean
}

type AttractionsType = {
  _links: _selfLinkType
  type: string
  id: string
  locale: string
  name: string
  description: string
  additionalInfo: string
  url: string
  images: ImageType[]
  classifications: ClassificationsAttractionType[]
  externalLinks: Record<string, never>
  test: boolean
  aliases: string[]
  localizedAliases: Record<string, never>
  upcomingEvents: Record<string, never>
}

type _EmbeddedAttractionType = {
  attractions: AttractionsType[]
}

type PageAttractionType = {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

type _LinksAttractionType = {
  self: LinkType
  next: LinkType
  prev: LinkType
}

export type AttractionResponseType = {
  _links: _LinksAttractionType
  _embedded: _EmbeddedAttractionType
  page: PageAttractionType
}

/**
 * Types for creators event
 */

export type VenueType = {
  _links: _selfLinkType
  type: string
  distance: number
  name: string
  description: string
  units: string
  id: string
  test: boolean
  url: string
  locale: string
  postalCode: string
  timezone: string
  additionalInfo: string
  currency: string
  aliases: string[]
  city: {
    name: string
  }
  state: {
    stateCode: string
    name: string
  }
  country: {
    name: string
    countryCode: string
  }
  address: {
    line1: string
    line2: string
    line3: string
  }
  location: LocationType
  markets: [
    {
      id: string
    },
  ]
  images: ImageType[]
  dma: [
    {
      id: number
    },
  ]
  social: {
    twitter: {
      handle: string
      hashtag: string[]
    }
  }
  boxOfficeInfo: {
    phoneNumberDetail: string
    openHoursDetail: string
    acceptedPaymentDetail: string
    willCallDetail: string
  }
  parkingDetail: string
  accessibleSeatingDetail: string
  generalInfo: {
    generalRule: string
    childRule: string
  }
  externalLinks: Record<string, never>
  localizedAliases: Record<string, never>
  upcomingEvents: Record<string, never>
  ada: {
    adaPhones: string
    adaCustomCopy: string
    adaHours: string
  }
}

export type DateType = {
  start: {
    localDate: string
    localTime: LocalTimeType
    dateTime: string
    dateTBD: boolean
    dateTBA: boolean
    timeTBA: boolean
    noSpecificTime: boolean
  }
  end: {
    localDate: string
    localTime: LocalTimeType
    dateTime: string
    approximate: boolean
    noSpecificTime: boolean
  }
  access: {
    startDateTime: string
    startApproximate: boolean
    endDateTime: string
    endApproximate: boolean
  }
  timezone: string
  status: {
    code: string
  }
  spanMultipleDays: boolean
}

export type PageCreatorEventsType = {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

type EventsCreatorEventsType = {
  _links: {
    self: LinkType
    attractions: LinkType[]
    venues: LinkType[]
  }
  _embedded: {
    venues: VenueType[]
    attractions: AttractionsType[]
  }
  name: string
  type: string
  distance: number
  units: string
  id: string
  test: boolean
  url: string
  locale: string
  images: ImageType[]
  location: LocationType
  description: string
  additionalInfo: string
  dates: DateType
  sales: {
    public: {
      startDateTime: string
      startTBD: boolean
      startTBA: boolean
      endDateTime: string
    }
    presales: [
      {
        name: string
        description: string
        url: string
        startDateTime: string
        endDateTime: string
      },
    ]
  }
  info: string
  pleaseNote: string
  priceRanges: [
    {
      type: string
      currency: string
      min: number
      max: number
    },
  ]
  promoter: PromoterType
  promoters: PromoterType[]
  outlets: [
    {
      url: string
      type: string
    },
  ]
  productType: string
  products: [
    {
      name: string
      id: string
      url: string
      type: string
    },
  ]
  seatmap: {
    staticUrl: string
  }
  accessibility: {
    info: string
  }
  ticketLimit: {
    infos: Record<string, never>
    info: string
  }
  classifications: [
    {
      primary: boolean
      segment: {
        id: string
        name: string
      }
      genre: {
        id: string
        name: string
      }
      subGenre: {
        id: string
        name: string
      }
      type: ClassificationsTypes
      subType: IDNameLocaleType
      family: boolean
    },
  ]
  place: {
    area: {
      name: string
    }
    address: {
      line1: string
      line2: string
      line3: string
    }
    city: {
      name: string
    }
    state: {
      stateCode: string
      name: string
    }
    country: {
      countryCode: string
      name: string
    }
    postalCode: string
    location: LocationType
    name: string
  }
  externalLinks: Record<string, never>
  aliases: string[]
  localizedAliases: Record<string, never>
}

type _EmbeddedCreatorEventsType = {
  events: EventsCreatorEventsType[]
}

export type creatorEventsType = {
  _embedded: _EmbeddedCreatorEventsType
  _links: _LinksAttractionType
  page: PageCreatorEventsType
}
