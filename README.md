# Kindle EPUB Fix

Amazon Send-to-Kindle service has accepted EPUB, however, for historical reason
it still assumes ISO-8859-1 encoding if no encoding is specified. This creates weird formatting errors for special characters.

This tool will try to fix your EPUB by adding the UTF-8 specification to your EPUB. It currently does
not fix other errors.

You can access this tools at https://epub.sanziomonti.com

**Warning:** This tool come at no warranty. Please still keep your original EPUB.
We don't guarantee the resulting file will be valid EPUB file, but it should.

Forked from innocenat/kindle-epub-fix
