import { decodeBase64 } from 'helpers/helpers';
import * as CNDecoders from 'apiHelper/ApiHandlers/CNAPI/cn-decoders';

export const decodeUser = (user: any) => ({
  ...(user || {}),
  UserName: decodeBase64(user?.UserName),
  FirstName: decodeBase64(user?.FirstName),
  LastName: decodeBase64(user?.LastName),
  FullName: decodeBase64(user?.FullName),
  MainPhoneNumber: decodeBase64(user?.MainPhoneNumber),
  MainEmailAddress: decodeBase64(user?.MainEmailAddress),
  AboutMe: decodeBase64(user?.AboutMe),
  City: decodeBase64(user?.City),
  Organization: decodeBase64(user?.Organization),
  Department: decodeBase64(user?.Department),
  JobTitle: decodeBase64(user?.JobTitle),
  AvatarName: decodeBase64(user?.AvatarName),
  PhoneNumbers: (user?.PhoneNumbers || []).map((x) => decodePhoneNumber(x)),
  Emails: (user?.Emails || []).map((x) => decodeEmailAddress(x)),
  Nodes: (user?.Nodes || []).map((x) => CNDecoders.decodeNode(x)),
});

export const decodePhoneNumber = (number: any) => ({
  ...(number || {}),
  Number: decodeBase64(number?.Number),
});

export const decodeEmailAddress = (email: any) => ({
  ...(email || {}),
  Email: decodeBase64(email?.Email),
});
