import DefaultPlayerImage from '../assets/images/test.png'
import DefaultPlayerImage2 from '../assets/images/test2.png'
import DefaultPlayerImage3 from '../assets/images/test3.png'

export const title = 'PlayerVista | Player Management System'
export const cloudName = import.meta.env.VITE_CLOUD_NAME
export const cloudUploadPresets = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESETS

export type PlayerType = {
  id: number
  countryCode: string
  country: string
  dob: string
  name: string
  position: string
  age: string
  appearance: string
  number: string
  imgSrc: string
}

export const players: PlayerType[] = [
  {
    id: 123,
    countryCode: 'NG',
    country: 'Nigeria',
    name: 'Abdul Jabber',
    position: 'CM',
    dob: '11/02/2002',
    age: '21',
    appearance: '52',
    number: '10',
    imgSrc: DefaultPlayerImage,
  },
  {
    id: 433,
    countryCode: 'US',
    country: 'United States of America',
    name: 'Rashad Dennis',
    position: 'CF',
    dob: '14/05/2005',
    age: '18',
    appearance: '102',
    number: '9',
    imgSrc: DefaultPlayerImage2,
  },
  {
    id: 221,
    countryCode: 'GB',
    country: 'United Kingdom',
    name: 'Mid Better',
    position: 'GK',
    dob: '11/01/1994',
    age: '29',
    appearance: '5',
    number: '1',
    imgSrc: DefaultPlayerImage3,
  },
  {
    id: 78,
    countryCode: 'IE',
    country: 'Ireland',
    name: 'Abdul Jabber',
    position: 'CM',
    dob: '11/02/2002',
    age: '21',
    appearance: '52',
    number: '8',
    imgSrc: DefaultPlayerImage,
  },
  {
    id: 12,
    countryCode: 'GH',
    country: 'Ghana',
    name: 'Rashad Dennis',
    position: 'LB',
    dob: '11/02/2005',
    age: '18',
    appearance: '102',
    number: '3',
    imgSrc: DefaultPlayerImage2,
  },
  {
    id: 3,
    countryCode: 'NG',
    country: 'Nigeria',
    name: 'Mid Better',
    position: 'GK',
    dob: '16/01/1994',
    age: '29',
    appearance: '5',
    number: '12',
    imgSrc: DefaultPlayerImage3,
  },
]
