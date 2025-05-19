// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Park Interface
export interface Park {
  id: string;
  url: string;
  fullName: string;
  parkCode: string;
  description: string;
  latitude: string;
  longitude: string;
  latLong: string;
  activities: Array<{ id: string; name: string }>;
  topics: Array<{ id: string; name: string }>;
  states: string;
  contacts: {
    phoneNumbers: Array<{ phoneNumber: string; description: string; extension: string; type: string }>;
    emailAddresses: Array<{ description: string; emailAddress: string }>;
  };
  entranceFees: Array<{ cost: string; description: string; title: string }>;
  entrancePasses: Array<{ cost: string; description: string; title: string }>;
  fees: Array<any>;
  directionsInfo: string;
  directionsUrl: string;
  operatingHours: Array<{
    exceptions: Array<any>;
    description: string;
    standardHours: {
      sunday: string;
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
    };
    name: string;
  }>;
  addresses: Array<{
    postalCode: string;
    city: string;
    stateCode: string;
    line1: string;
    line2: string;
    line3: string;
    type: string;
  }>;
  images: Array<{
    credit: string;
    title: string;
    altText: string;
    caption: string;
    url: string;
  }>;
  weatherInfo: string;
  name: string;
  designation: string;
}

// Alert Interface
export interface Alert {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  lastIndexedDate: string;
}

// Event Interface
export interface Event {
  id: string;
  url: string;
  title: string;
  description: string;
  locationDescription: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
  contactName: string;
  contactTelephoneNumber: string;
  contactEmailAddress: string;
  feeInfo: string;
  isRecurring: string;
  isAllDay: string;
  dates: Array<string>;
  images: Array<{
    credit: string;
    title: string;
    altText: string;
    caption: string;
    url: string;
  }>;
}

// Visitor Center Interface
export interface VisitorCenter {
  id: string;
  url: string;
  name: string;
  parkCode: string;
  description: string;
  latitude: string;
  longitude: string;
  latLong: string;
  directionsInfo: string;
  directionsUrl: string;
  operatingHours: Array<{
    exceptions: Array<any>;
    description: string;
    standardHours: {
      sunday: string;
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
    };
    name: string;
  }>;
  addresses: Array<{
    postalCode: string;
    city: string;
    stateCode: string;
    line1: string;
    line2: string;
    line3: string;
    type: string;
  }>;
}

// Amenities Interface
export interface Amenity {
  id: string;
  name: string;
  available: boolean;
}

// API Response Interfaces
export interface NPSResponse<T> {
  total: string;
  limit: string;
  start: string;
  data: T[];
}
