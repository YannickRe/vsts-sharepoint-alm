export interface IAddedAppInfo { 
    'odata.metadata': string;
    'odata.type': string;
    'odata.id': string;
    'odata.editLink': string;
     CheckInComment: string;
     CheckOutType: number;
     ContentTag: string;
     CustomizedPageStatus: number;
     ETag: string;
     Exists: boolean;
     IrmEnabled: boolean;
     Length: string;
     Level: number;
     LinkingUri: string;
     LinkingUrl: string;
     MajorVersion: number;
     MinorVersion: number;
     Name: string;
     ServerRelativeUrl: string;
     TimeCreated: string;
     TimeLastModified: string;
     Title: string;
     UIVersion: number;
     UIVersionLabel: string;
     UniqueId: string;
}