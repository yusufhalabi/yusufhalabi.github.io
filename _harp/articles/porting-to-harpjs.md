Until recently, I’ve been using [Cactus for Mac](http://cactusformac.com/ "Cactus for Mac") to generate this website. Active development [ended December 2014](http://cactusformac.com/blog/posts/cactus-and-glueprint.html), but I was too lazy to port…until the release of El Capitan broke several pretty important Cactus features, including Sass compilation.

I found [HarpJS](http://harpjs.com) after a little Googling, and it seemed to fit the bill: super-simple asset pipeline, flexible layout system, and metadata support. And so I set about porting my site from the Python-based Cactus to Harp. This process consisted of three main subtasks:

1. **Translating templates to Jade**: Cactus used the Django templating language; Harp supports EJS and Jade. Despite the stronger parallels between Django and EJS templating, I opted to use Jade for its wonderfully terse syntax. I also chose to rewrite all my templates by hand to familiarize myself with Jade.
2. **Rethinking layouts to fit Harp’s layout system**: Harp supports Jade’s `block`/`extends` inheritance model, but it also comes with its own [layout system](http://harpjs.com/docs/development/layout). I ended up rewriting my templates to use Harp’s native model of `yield`s and `partial`s.
3. **Re-organizing metadata**: Unlike Cactus, Harp does not support frontmatter in individual page files. Instead, it uses a centralized `_data.json` file in each directory. I re-structured all my article and project pages to work with this model of metadata storage.

Along the way, I encountered several unexpected roadblocks. The following write-up details how I ended up solving these problems.

### 1. Application structure with GitHub User Pages
I host this site on GitHub Pages — specifically, my User page. All GitHub Pages are served from the root of their repository, and User pages in particular must be served from the `master` branch.

Here's how my repository is structured (obviously simplified for example's sake):
```
sarahlim.github.io/
    +- _harp/
        |- index.jade
    |- index.html
    |- README.md  // Manually placed
    |- CNAME  // Manually placed
```

The contents of the main directory, from top to bottom:
1. `_harp/`, the root of my Harp app (equivalent to `/public` in non-GitHub Pages sites). It contains `index.jade`, my "raw" Jade page.
2. `index.html`, the "flattened" version of `_harp/index.jade`, produced by `harp compile`.
3. `README.md` and `CNAME`, manually placed in the repo root.


Harp’s [documentation for deploying to GitHub Pages](http://harpjs.com/docs/deployment/github-pages) provides the appropriate command for compiling to the root:
    harp compile _harp ./

Easy enough, right? Well, not quite. Since `harp compile` wipes the output directory and rebuilds it anew each time, any CNAME or README.md files I placed in the root directory were deleted every time I compiled a new build.
[Conor O’Neill](http://conoroneill.net/the-nitty-gritty-of-moving-from-wordpress-to-harpjs/)’s blog post has a quick fix for the CNAME problem. I simply moved the file into `_harp/`, and modified `_harp/_data.json` by adding the following property:
```
"CNAME": { "layout": false }
```

The README.md problem was slightly tricker. I couldn’t just move it into my app directory and exempt it from layouts, because Harp would still auto-compile Markdown to HTML. I ended up adding two files to `_harp/`: my README, with the filename prefixed with an underscore (Harp ignores these during compilation), and a shell script containing the following command:
```
harp compile ./ ../ && cp _README.md ../README.md
```

Instead of running `harp compile`, I run this script, and it automatically copies and renames my README accordingly.

### 2. Auto-refresh
Cactus had awesome auto-refresh. I was surprised to find that even though `harp server` tracks file changes to manage asset re-compilation, Harp lacks native support for live reloading. [This](https://github.com/sintaxi/harp/issues/80) GitHub discussion proposes several solutions, ranging from custom bash scripts to auto-launch [LiveReloadX](http://nitoyon.github.io/livereloadx/) along with `harp server`, to forks integrating Harp with the various reload libraries-of-the-moment. After trying several solutions with varied success, I ended up adopting the KISS approach [suggested by Alexander Prinzhorn](https://github.com/sintaxi/harp/issues/80#issuecomment-58925661).

Install [browser-sync](https://www.browsersync.io/) if you haven’t already:
```
npm install -g browser-sync
```

Then, from the main directory of your Harp application, run the following command:
```
browser-sync start --proxy 'localhost:9000' --files ‘.jade, .scss’
```

(Obviously, you should modify the port and file extensions accordingly. For instance, if you use LESS, replace `*.scss` with `*.less`.)

This might be a no-brainer to everyone else, but make sure to run browser-sync in the root directory of your Harp application, where your “raw” assets are located. This isn’t necessarily the root of your entire project — for me it was `/_harp`, and for you it might be `/public`. I misunderstood how `harp server` worked, and made the mistake of trying to run browser-sync in the root of my project folder, where my compiled assets were held.

### 3. Nested layouts
As mentioned previously, Harp has its own layout system built on _inclusion_. A top-level template called `_layout` can include the contents of other files, using the `partial` and `yield` variables. This paradigm differs from Jade’s model of inheritance, which is built on _extension_; sub-layouts extend parent templates by overriding blocks of markup and content.

Harp apps are structured such that the main directory contains a template called `_layout.jade` (or `_layout.ejs`). This layout, which typically contains markup common across all pages (such as site-wide headers and footers), “masks” every page served from the same directory. Pages contained in subdirectories also use the parent `_layout`, unless there is a separate template defined inside the subdirectory, in which case the child `_layout` overrides the parent.

So, I had (what I assumed to be) a fairly simple nested layout in mind. My site contains a few top-level pages (`index.jade`, `about.jade`, etc.), along with two subdirectories called `/projects` and `/articles`. Each subdirectory contains its own index — the overview pages for my portfolio and blog, respectively — along with a series of Markdown files, each representing one article or project. I wanted to define a “base” `_layout` in the root of my Harp app, which would sandwich the `yield` variable between my site-wide header and footer. Every page on the site would use this layout.

In addition, I wanted to wrap each project and article page — but _not_ the subdirectory index pages — in a “decorator” template, which would display relevant metadata. In a nutshell, I wanted:
1. A base layout, including my site-wide header and footer;
2. An article layout, which would extend my base layout by adding metadata decorations to the Markdown articles themselves.

Harp’s [documentation on nested layouts](http://harpjs.com/docs/development/layout) is not terribly clear:
> If you are taking advantage of Harp’s built-in support for Jade, you may use Jade’s Block and Extends features to create nested layouts.

From that line, I naïvely assumed I could just create the following layouts:
```
//- _harp/_layout.jade

// ...header stuff here

block main
    != yield

// ...footer stuff here
```

```
//- _harp/articles/_layout.jade

extends ../_layout

block main
    // ...article decorator stuff here
    != yield
```

Except, I found out, you can’t actually combine Jade blocks and extensions with Harp’s `yield`-based includes. So I ended up writing a single `_layout`, using conditional statements with Harp’s `current` object (documented [here](http://harpjs.com/docs/development/current)), like so:
```
//- _harp/_layout.jade

// ...header stuff here

//- Main content
if current.path[0] === "articles" && current.path[1] != "index"
    //- Article decorator stuff
    != yield
else if current.path[0] === "projects" && current.path[1] != "index"
    //- Project decorator stuff
    != yield
else 
    != yield

// ...footer stuff here
```

There it is. No need to mess with `_data.json`, no need to build multiple layouts. P spicy.

Overall, Harp has worked swimmingly for my needs. Site updates are simple after completing the initial legwork. If you’re considering porting to Harp, my website is entirely [open-sourced on GitHub](https://github.com/sarahlim/sarahlim.github.io); feel free to look around.