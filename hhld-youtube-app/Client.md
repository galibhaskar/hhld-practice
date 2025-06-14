# Common Mistakes & Tips - Client

### Problems:
1. **Problem 1**
   - **Info:** .env variables access for endpoints like http://localhost:4000/upload are not being accessed in the frontend.
   
   - **Reason:** By default, .env variables are only available on the server side in Next.js to protect sensitive data.
   
   - **Fix:** To expose the .env variables to client, Prefix the variables using **"NEXT_PUBLIC_"**.

2. **Problem 2**
   - **Info:** React Hooks(useEffect, useState, useSession) only works in client component.

   - **Reason:** By default, all components in Next.js are Server Components, that is to improve SEO. If we need, we have to manually convert the server components into client components.

   - **Fix:** Add **"use client"** at the top of the file, to make it as Client-Side Component. 

   - **Note:** React Hooks, Dynamic or Interactive Components(Random Number, Timers, Video players, Music players, Socket Connections, Components that use Browser APIs) should be desinged as client components. Data fetching, Static UI can be server components.

3. **Problem 3**
   - **Info:** Hydration Error

   - **Reason:** In SSR (Server-Side Rendering), Next.js:
        1) Renders the HTML on the server.
        2) Sends it to the browser.
        3) React then "hydrates" the static HTML — attaches React logic to it so it becomes interactive.
        4) If the server-rendered HTML is different from what React expects to render on the client → **Hydration error**.

   - **Fix:** 
        1) **"use client"** to make it as client side component
        2) Delayed the rendering Ex: 
            ```
            if(!data) return null; 

            return <Component>;
            ```
        3) Turn off the ssr using dynamic package.
            Ex: 
            ```
            import dynamic from "next/dynamic"; 

            const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
            ```

### Tips:
1. **Tip 1**
   - **Info:** Authentication in Next.js
   - **Solution:** 
        1) package: `next-auth `
        2) Provides access to useSession, signIn and signOut if Session Provider is wrapped in the body.

2. **Tip 2**
   - **Info:** OAuth - Third party(Google, GitHub, Apple,...) in Next.js
   - **Solution:** 
        1) package: `next-auth`
        2) Create a route in Next.js server with the directory -> `/api/auth/[...nextauth]`.
        3) Add third party provider code in `route.js` inside the `[...nextauth]` directory.
        4) This exposes the endpoint for third party authentication providers from Next.js server.
    
3. **Tip 3**
   - **Info:** Routing/Navigation in Next.js
   - **Solution:** 
        1) package: `next/navigation`
        2) Create router instance using **useRouter()** and can use `routerInstance.push()` or `routerInstance.replace()`.
        3) We can use **redirect()** from next/navigation for redirection.

4. **Tip 4**
   - **Info:** Navigation in Next.js
   - **Solution:** 
        1) package: no package needed
        2) Create a folder with the required route - `upload` and add `page.jsx`. The route will be exposed directly as `/upload`


5. **Tip 5**
   - **Info:** Uploading large files to Server or S3
   - **Solution:** 
        1) package: `aws-sdk`(for S3 multipart upload)
        2) Chunk the file on client side using `file.slice(start, start+chunkSize)`
        3) Follow 3-step multipart upload
            - Step-1: Intialize the multipart upload using the `filename/key` for `uploadID`.
            - Step-2: Upload all the chunks individually to S3 using `uploadID`.
            - Step-3: Complete the multipart upload using `uploadID`.

6. **Tip 6**
   - **Info:** Streaming large files based on Bitrates(HLS - HTTP Live Streaming)
   - **Solution:** 
        1) package: `hls.js`
        2) Get the url of `master.m3u8`(Manifest file that contains m3u8 files for different bitrate - 144p, 240p, ....) and add it as source for react video player.
    - **Note:** We can replace HLS(by apple) with DASH(Dynamic Adaptive Streaming over HTTP - by microsoft, netflix, google). 