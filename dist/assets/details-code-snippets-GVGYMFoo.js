const e=`<?xml version="1.0" encoding="UTF-8"?>
<DistributionConfig>
   <Aliases>
      <Quantity>1</Quantity>
      <Items>
         <CNAME>example.com</CNAME>
      </Items>
   </Aliases>
   <DefaultCacheBehavior>
      <Compress>true</Compress>
      <DefaultTTL>3600</DefaultTTL>
   </DefaultCacheBehavior>
   <Enabled>true</Enabled>
   <Origins>
      <Quantity>1</Quantity>
      <Items>
         <Origin>
            <DomainName>S3-aws-phoenix.example.com</DomainName>
         </Origin>
      </Items>
   </Origins>
</DistributionConfig>`,i=`{
  "DistributionConfig": {
    "Aliases": {
      "Quantity": 1,
      "Items": [
        {
          "CNAME": "example.com"
        }
      ]
    },
    "DefaultCacheBehavior": {
      "Compress": true,
      "DefaultTTL": 3600
    },
    "Enabled": true,
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Origin": {
            "DomainName": "S3-aws-phoenix.example.com"
          }
        }
      ]
    }
  }
}`,t=`DistributionConfig:
  Aliases:
    Quantity: 1
    Items:
      - CNAME: example.com
  DefaultCacheBehavior:
    Compress: true
    DefaultTTL: 3600
  Enabled: true
  Origins:
    Quantity: 1
    Items:
      - Origin:
          DomainName: S3-aws-phoenix.example.com`,a={json:i,yaml:t,xml:e};export{a as codeSnippets};
