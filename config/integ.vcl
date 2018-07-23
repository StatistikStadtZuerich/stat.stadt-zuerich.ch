#
# See the VCL chapters in the Users Guide at https://www.varnish-cache.org/docs/
# and https://www.varnish-cache.org/trac/wiki/VCLExamples for more examples.

# Marker to tell the VCL compiler that this VCL has been adapted to the
# new 4.0 format.
vcl 4.0;

# backend definitions
backend ld {
    .host = "ld";
    .port = "8080";
}

backend stat {
    .host = "stat";
    .port = "8080";
}

backend stip {
    .host = "stip";
    .port = "3000";
}

backend puppetron {
    .host = "puppetron";
    .port = "3000";
}

sub vcl_recv {
    # Happens before we check if we have this in cache already.
    #
    # Typically you clean up the request here, removing cookies you don't need,
    # rewriting the request, etc.

    set req.http.X-Forwarded-Port = "80";

    if (req.http.host ~ "ld.integ.stadt-zuerich.ch|ld-integ.zazuko.com") {
        if (req.url == "/") {
            return (synth(302, "/sparql/"));
        }
        else {
            set req.backend_hint = ld;
        }
    }
    elsif (req.http.host ~ "stat.integ.stadt-zuerich.ch|stat-integ.zazuko.com") {
      if (req.url == "/api" || req.url ~ "^/js/.*$" || req.url ~ "^/sparql/.*$" || req.url ~ "^/query.*$" || req.url ~ "(\?|\&)format=" || (req.http.Accept !~ "html" && req.url !~ "^/_next/" && req.url !~ "^/static/")) {
        set req.backend_hint = stat;
      }
      elseif(req.url ~ "^/screenshot/.*$" || req.url ~ "^/pdf/.*$") {
        set req.backend_hint = puppetron;
      }
      else {
          set req.backend_hint = stip;
      }
    }
    else {
        set req.backend_hint = ld;
    }
}

sub vcl_backend_response {
    set beresp.http.Vary = "Accept";

    # Happens after we have read the response headers from the backend.
    #
    # Here you clean the response headers, removing silly Set-Cookie headers
    # and other mistakes your backend does.
}

sub vcl_deliver {
    # Happens when we have all the pieces we need, and are about to send the
    # response to the client.
    #
    # You can do accounting or modifying the final object here.

    # Fix CORS for host
    #if (req.http.host ~ "data.zazuko.com$") {
    #    set resp.http.Access-Control-Allow-Origin = "*";
    #}
}


sub vcl_synth {
    if (resp.status == 301 || resp.status == 302) {
        set resp.http.location = resp.reason;
        set resp.reason = "Moved";
        return (deliver);
    }
}
