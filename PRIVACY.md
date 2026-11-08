# Privacy Policy

Last updated: November 8, 2026

## Scope and contact

This policy describes the public PAD MCP Lite service at `https://pad-mcp-lite.mathya.it/mcp`, operated by the independent project maintainer [ttiaMa](https://github.com/ttiaMa). It also describes how project support requests are handled. It does not cover instances hosted by other people; their operators are responsible for their own data practices.

For questions or privacy requests, contact the maintainer through [GitHub Issues](https://github.com/ttiaMa/pad-mcp-lite/issues). Issues are public: do not post personal data, credentials or confidential information. If your request requires private information, ask for a private contact channel first.

## Information processed

- **MCP requests:** the service receives the tool name, arguments and protocol metadata sent by your MCP client. Arguments include the selected Classic or Power Fx edition, search terms, module names, action identifiers, type names and result limits. Only information sent to the service is available to it; it does not independently retrieve your conversation history.
- **Connection information:** network infrastructure receives connection details such as an IP address, request time, URL, HTTP headers and response status. When a cloud client connects on your behalf, the connection address may belong to that provider rather than your device.
- **Operational information:** the application emits startup and error messages. Hosting, container and reverse-proxy systems may retain these messages and access or security logs. Error details can contain information associated with a failed request.
- **Support information:** if you open an issue or otherwise contact the maintainer, the information you choose to provide is processed to respond to your request.

The service has no user accounts, passwords, payment collection, advertising trackers or analytics SDKs. Its MCP endpoint does not set cookies. It cannot read your local files, inspect your desktop, connect to your Microsoft account or run your Power Automate Desktop flows. Do not include personal data, secrets or proprietary flow content in search queries.

## Purposes and sharing

Request information is used to return reference material from the bundled catalogs. Technical information is used to deliver the service, enforce request limits, diagnose errors and protect availability. Support information is used to address inquiries. Where a legal basis is required, these activities rely on the legitimate interests of providing and securing the service and responding to requests; information may also be processed to meet applicable legal obligations.

Catalog lookups run against bundled files. The application does not forward searches to Microsoft, an AI model provider, or an external catalog API. Responses go back to the MCP client that requested them. Infrastructure providers necessarily process information to host and deliver the service. Information may also be disclosed where required by law or necessary to address abuse or security incidents. The service does not sell personal information or use requests for advertising or model training.

## Storage and retention

The application does not maintain a database of users, conversations or search history, and does not routinely write request bodies to persistent storage. Rate limiting uses a bounded in-memory buffer of request timestamps shared across clients, without user identifiers or IP addresses. The rolling limit covers 60 seconds; timestamps are overwritten as the buffer advances and cleared on process restart.

Operational and infrastructure logs are separate from that buffer. Their retention depends on the hosting, container and reverse-proxy configuration; the application's 60-second rate limit is not a log-deletion schedule. Contact the maintainer for the current infrastructure retention settings or a deletion request. Support records remain in the relevant support system for handling and documenting the request, subject to its retention and deletion controls. Information should be retained only as needed for these operational, support, security or legal purposes.

## Other services and security

Your AI or MCP client independently processes your conversations, tool calls and responses under its own terms and privacy policy. GitHub processes repository visits and support activity under the [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). Those providers may process information in other countries under their own arrangements.

The public endpoint uses HTTPS. No internet service can guarantee absolute security. Avoid sending information that is unnecessary for a catalog lookup.

## Your choices and rights

You can stop requests by disconnecting the MCP server in your client. Depending on applicable law, you may request access, correction, deletion, restriction or portability of personal information, object to processing, or complain to the relevant data protection authority. Contact the maintainer using the route above. Requests concerning data retained by your AI client or GitHub should also be directed to those providers. The service does not create user profiles to identify anonymous past requests.

## Changes

Updates will be published here with a revised date. Material changes will also be noted in the repository's public history.

---

Document structure adapted from the [PolicyForge basic privacy template](https://github.com/ryuno2525/privacy-policy-templates/blob/main/templates/privacy-policy-basic.md), substantially rewritten for this service. [Template MIT license and notice](docs/LEGAL_TEMPLATE_LICENSE.txt).
