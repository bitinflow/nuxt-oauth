# Upgrade Guide

## General Notes

## Upgrading To 2.0 From 1.x

### Changing default response type to `code`

OAuth 2 Implicit Grant Token authentication
is [not recommended](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics) anymore. If you still
want to use the `token` response type, you need to set it explicitly with `responseType: 'token'` in the
`oauth` configuration. Otherwise, you will use Authorization Code Grant with PKCE by default.

