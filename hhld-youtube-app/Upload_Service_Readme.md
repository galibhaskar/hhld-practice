## # Common Mistakes & Tips - Upload Service

### Problems:
1. **Problem 1**
   - **Info:** Prisma Client import

   - **Reason:** Issue in importing prisma client from package - `@prisma/client`

   - **Fix:** Import the PrismaClient from `../generated/prisma`

2. **Problem 2**
   - **Info:** Uploading files to S3 Errors
        1) uploadID invalid
        2) AllAccessDisabled
        3) NoSuchUpload exists

   - **Reason:** 
        1) Bucket Permissions - Access Policy or CORS policy.
        2) Mismatched key during multipart upload initialization and upload.

   - **Fix:** 
        1) Update the bucket policies.
            ```
                // Bucket Policy
                {
                    "Version": "2008-10-17",
                    "Statement": [
                        {
                            "Sid": "Allow",
                            "Effect": "Allow",
                            "Principal": {
                                "AWS": "*"
                            },
                            "Action": "s3:GetObject",
                            "Resource": "arn:aws:s3:::hhld-youtube-s3-multipart/*",
                        }
                    ]
                }
            
            ```
            ```
                //  CORS Policy
                [
                    {
                        "AllowedHeaders": [
                            "*"
                        ],
                        "AllowedMethods": [
                            "PUT",
                            "POST",
                            "HEAD",
                            "GET"
                        ],
                        "AllowedOrigins": [
                            "*"
                        ],
                        "ExposeHeaders": [
                            "x-amz-server-side-encryption",
                            "x-amz-request-id",
                            "x-amz-id-2",
                            "ETag"
                        ],
                        "MaxAgeSeconds": 3000
                    }
                ]
            ```

        2) Maintain constant `key` for 3-phase in multipart upload.


### Tips:
1. **Tip 1**
   - **Info:** Folder Structure
   - **Solution:** 
        1) `index.js` - Start File
        2) `routes/[name].route.js` - individual routeHandlers inside the routes directory.
        3) `controllers/[name].controller.js` - individual services inside the controllers directory.
        4) `.env` - env file imported to code files using `dotenv` package
        5) `prisma/*` - migrations and schema directory created during `npx prisma init`. Helps in modifying the database schema.
        6) `generated/*` - directory created during `npx prisma generate`
        7) `db/db.js` - prisma client (ORM). Make sure `prisma/*` and `generated/*` are created before using the ORM.
        8) `kafka/kafka.js` - kafka interactions for publishing or consuming the messages.