# Cotham Gardens PTFA website

Source code for [https://cothamgardensptfa.co.uk/](https://cothamgardensptfa.co.uk/)

## Design Goals / Constraints

The goal of this project is to make a PTFA website that is:

* Free to host
* Serverless (no wordpress/mysql to maintain)
* Secure
* Updatable content by non-technical users

Bonus features:

* Fast
* Easy to maintain / understand (no magic!)
* Accessible
* Good SEO

## Architecture

This site is built with the [Astro framework](https://astro.build/). A [Github action](https://github.com/features/actions) builds the site as static files which are then deployed and hosted by Github pages. This happens on every push to `main`.

## Getting started

    npm install
    npm run dev

## Updating content

Content is written in Markdown files. These are editable via the https://decapcms.org/ web UI accessible at: https://cothamgardensptfa.co.uk/admin

Rather than require editors create Github accounts, we use [Decapbridge](https://decapbridge.com/) to provide Auth, which in turn has been configured with a github access token to that it can push changes on the users' behalf. Users are currently administered by me, so get in touch if there's a better way to solve this or you want to become admin.

If you're a dev and you'd like to update content on your local machine, run a local decap-server:

    npx decap-server
