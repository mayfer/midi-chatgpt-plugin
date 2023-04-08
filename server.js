const rfr = require('rfr');
const fs = require('fs');
const express = require('express')
const basicAuth = require('express-basic-auth');
const app = express()
const port = 9102

app.set('views', __dirname);
app.use(express.json());

const cors = require('cors');


const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { Midi } = require('@tonejs/midi')


const { argv } = require('yargs');


(async () => {

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true,
        defer: true,
        limit: 1024 * 1024 * 100,
        parameterLimit: 100000,
    }));
    app.use(bodyParser.json());
    app.use(require('cookie-parser')());

    // CORS allow all
    app.use(cors());


    app.set('json spaces', 2)

    app.get('/', (req, res) => {
        res.json({ message: 'Hello World!' })
    })

    app.get('/api/melody', (req, res) => {
        const { text } = req.query;
        const response = [
            { "note": 60, "duration": 1 },
            { "note": 62, "duration": 1 },
            { "note": 64, "duration": 1 },
            { "note": 65, "duration": 1 },
            { "note": 67, "duration": 1 },
            { "note": 69, "duration": 1 },
            { "note": 71, "duration": 1 },
            { "note": 72, "duration": 2 }
        ]

        res.json({"melody": JSON.stringify(response)})
    })

    app.get('/.well-known/openapi.json', (req, res) => {
        res.json({
            "openapi": "3.0.0",
            "info": {
                "title": "MIDI Plugin",
                "description": "Plugin for generating a MIDI melody based on the user's description.",
                "version": "1.0.0"
            },
            "servers": [
                {
                    "url": "http://localhost:9102",
                    "description": "Dev server"
                }
            ],
            "paths": {
                "/api/melody": {
                    "get": {
                        "summary": "Generate a melody",
                        "description": "Generate a melody as a string based on the user's description.",
                        "operationId": "getMelody",
                        "parameters": [
                            {
                                "name": "text",
                                "in": "query",
                                "description": "The user's description of the melody.",
                                "required": true,
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Melody generated successfully.",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "melody": "string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                }
            }
        })
    });

    app.get('/.well-known/ai-plugin.json', (req, res) => {
        res.json({
            "schema_version": "v1",
            "name_for_model": "midi",
            "name_for_human": "MIDI Plugin",
            "description_for_model": "Plugin for generating a MIDI melody based on the user's description.",
            "description_for_human": "Generate MIDI tracks.",
            "auth": {
                "type":"none",
                // "client_url":"e.g. https://<your domain>/oauth/v2/authorize",
                // "authorization_url":"e.g. https://<your domain>/api/oauth.v2.access",
                // "scope":"search:read",
                // "authorization_content_type":"application/x-www-form-urlencoded",
                // "verification_tokens":{
                // "openai": "<token from add plugin flow from the ChatGPT UI>"
                // }
            },
            "api": {
                "url": "http://localhost:9102/.well-known/openapi.json",
                "has_user_authentication": false,
                "type": "openapi"
            },
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a0/MIDI_LOGO.svg",
            "contact_email": "murat@probablymurat.com",
            "legal_info_url": "murat@probablymurat.com"
        })


    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

})();


process.on('uncaughtException', function (err) {
    console.error('Caught exception: ', err);
});
