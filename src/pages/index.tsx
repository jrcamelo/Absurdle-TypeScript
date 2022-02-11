import Head from "next/head";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Home() {
    return (
        <div>
            <Head>
                <title>Swagger</title>
                <meta name="description" content="Swagger" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SwaggerUI url="/swagger.yaml" />
        </div>
    );
}
