# How to blog on acompa.net

## Clone my website and theme

[Quickstart for Pelican](http://docs.getpelican.com/en/3.6.3/quickstart.html).

```
GITHUB_DIR=~/repo    # change this!
cd $GITHUB_DIR
git clone https://github.com/acompa/pelican-sober
git clone git@github.com:acompa/acompa.github.com.git
git clone --recursive https://github.com/getpelican/pelican-plugins
```

I might have to update render-math:

```
cp -r $GITHUB_DIR/pelican-plugins/render_math ~/Dropbox/acompa.net/plugins
```

## Install pelican and my theme

```
mkvirtualenv acompa.github.com
pip install pelican markdown ghp-import
pelican-themes -i $GITHUB_DIR/pelican-sober
```

## Testing locally

My content lives in Dropbox. Once I've drafted a post:

```
cd ~/Dropbox/acompa.net
pelican content
cd ~/Dropbox/acompa.net/output
python3 -m pelican.server
```

[Then go to the local site](http://localhost:8000/). Looks good? Then:

```
ghp-import ~/Dropbox/acompa.net/output
git push origin gh-pages
```
