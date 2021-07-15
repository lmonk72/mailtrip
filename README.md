# Mailtrip
A simple bundler to help beat HTML email inconsistencies 👍.

## What is this project is trying to acheive?
HTML emails have been living in the early 2000’s for a long time and while web development has surged ahead, email development has drastically lagged behind. Email development remains dependant on the dated table-based approaches of old to get the most performant result across the greatest number of platforms and devices 📱. 

Emails ✉️ currently remain the **#1** form of communication between businesses and their audience. What we have here, is a recipe for disaster. Modern syntax, strong semantics, component-driven development workflows and UX are often relegated to the side-lines 👀.

While this tool cannot fix most of that, it is designed to give you a flexible component-oriented 'bundle'. Think Tailwind CSS meets HTML tables.

## What can this 'bundle' offer
Out of the box, you can:

- Write SASS/SCSS and have it compile to CSS
- Purge unused CSS to remove bloat
- Compress images
- Inline CSS
- Minify your HTML


## Future aims
At the moment, this project is in its infancy, and, as such is likely to need several adjustments before being considered production-ready.

I am aiming to get the bundle to ship:
- With a component library to allow you to pick and choose pre-styled entities
- With a 'brand-centric' configuration allowing you to create palettes and fonts which can be easily swapped between
- With a few pre-built themes

## What has this bundle being tested with?
To make sure the output is working as intended, it has gone through [W3C Markup Validation](https://validator.w3.org/#validate_by_input), referenced ['Can I Email'](https://caniemail.com) for browser support, and been tested in [Litmus's email preview tool](https://www.litmus.com/pre-send-testing/) to check rendering consistency.

## Known issues
- [ ] Media queries are not merging into HTML
- [ ] Need to remove redundant CSS `<link>` in HTML after compression
- [ ] Need to see if there's a way to remove unused CSS files once concatenated together