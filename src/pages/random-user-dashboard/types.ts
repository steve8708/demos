// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface UserName {
  title: string;
  first: string;
  last: string;
}

export interface UserLocation {
  street: {
    number: number;
    name: string;
  };
  city: string;
  state: string;
  country: string;
  postcode: string;
}

export interface UserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface UserLoginInfo {
  uuid: string;
  username: string;
  email: string;
}

export interface RandomUser {
  gender: string;
  name: UserName;
  location: UserLocation;
  email: string;
  login: UserLoginInfo;
  dob: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  picture: UserPicture;
  nat: string;
}

export interface RandomUserResponse {
  results: RandomUser[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

export interface RandomUserFilter {
  gender?: string;
  nationality?: string;
  resultsCount?: number;
}
