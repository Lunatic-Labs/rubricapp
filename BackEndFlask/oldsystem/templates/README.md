## Why is the css embedded in the html templates instead of in separate files?

Each template has a number of lines of css at the beginning, it is easy to test in that way, if we move the css to a separate fil-
e, it will then be hard to see changes on the web pages immediately.

## What's with the "usersnap" stuff commented out in some templates?
This code snippet are commented out in most of the templates, it's a feedback window from: https://usersnap.com/

```
{#<script type="text/javascript">#}
{#  (function() {#}
{#    var s = document.createElement("script");#}
{#    s.type = "text/javascript";#}
{#    s.async = true;#}
{#    s.src = '//api.usersnap.com/load/143a50cc-0af5-4778-a4ec-18269edf01a7.js';#}
{#    var x = document.getElementsByTagName('script')[0];#}
{#    x.parentNode.insertBefore(s, x);#}
{#  })();#}
{#</script>#}
```

