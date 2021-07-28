# Mailtrip
A simple bundler to help make email development less inconsistent, and more efficient 👍.

## The problem
Have you ever been asked to develop a HTML email(s)? If so, you will know what a nuisance it can be. It is like being caught in a time warp...

While web development has received a lot of much needed ❤️ and support (which is awesome) - email development has drastically lagged behind. While there has been some progress, email development remains wholly dependant on the dated table-based approaches of old.

The difference is staggering, and it needs to be addressed.

## What is this project is trying to acheive?

Like many other web developers, I found email development to be slow, inefficient, frustrating, and limited. Kiss goodbye to neat workflows, semantics and more.

While no single tool can remedy the out-of-date requirements, this 'bundle' aims to bridge some of the workflow issues, and puts a web development flavour on the table.

## What does this 'bundle' offer
Out of the box, you can:

- Write SASS/SCSS and have it compile to CSS
- Generate multiple classes based on a configuration file
- Purge unused CSS (to remove bloat)
- Compress your images
- Inline your CSS into the HTML
- Minify CSS
- Minify HTML
- Develop with a real-time output (via Browser-Sync)
- Output all cleaned and compressed files into a neat package (for easy asset sharing)

## Future aims
At the moment, this project is in its infancy, and, as such is likely to need several adjustments before being considered production-ready.

I am aiming to get the bundle to ship:
- With a component library to allow you to pick and choose pre-styled entities
- With a 'brand-centric' configuration allowing you to create palettes and fonts which can be easily swapped between
- With a few pre-built themes

## What has this bundle been tested with?
To make sure the output is working as intended, it has gone through [W3C Markup Validation](https://validator.w3.org/#validate_by_input), referenced ['Can I Email'](https://caniemail.com) for email client support, and been tested in [Litmus's email preview tool](https://www.litmus.com/pre-send-testing/) to check rendering consistency.

## Reference Materials 
New to email development? Here are a few resources which you might find helpful:
- ['How to Target Email Clients'](https://howtotarget.email/) - a quick way to identify ways of styling specific email clients
- ['Can I Email'](https://caniemail.com) - a comprehensive guide to HTML and CSS email client support

---
## Getting Started
To get up and running as quickly as possible, clone/download this project. 

Once the project is downloaded, run: `npm install`, to install *Gulp* (Version 4) and all of the dependencies needed. 

Because this process is using the task-runner 'Gulp', you can choose to change the configuration to suit your requirements. E.g. Swap gulp-clean-css for PostCSS and CSSNano and so on.