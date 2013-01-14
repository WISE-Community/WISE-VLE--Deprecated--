

## Overview
[This repository][] tracks the current _working_ [WISE4][] step of [MySystem][mysystem]

The export is a copy of all of the files found in vle/mysystem2/ directory after running `bundle exec rake build`
from a checkout of [MySystem][].

## Instructions:

The build process uses ruby. We recommend installing the Ruby Version Manager [rvm][] before getting started.

1. checkout [MySystem][]  `git clone git://github.com/concord-consortium/mysystem_sc.git`
1. enter the project directory: `cd mysystem_sc`
1. install required gems:  `bundle install`
1. build everything: `bundle exec rake build`
1. pop out to your development directory: `cd ..`
1. checkout [This repository][] `git clone https://<username>@github.com/concord-consortium/MySystem-Wise-Integration-WIP.git`
1. enter the directory: `cd MySystem-Wise-Integration-WIP`
1. copy the files over: `cp -r ../mysystem_sc/vle/node/mysystem2/* .`
1. commit your changes: `git ci -a -m "commit message here\n\n built from: 0cc30c0"`
1. optionally tag the commit: `git tag -a <tagName> -m "<more info here>"`
1. push the changes: `git push --tags`

## To Modify *THIS* Readme File

This README.md is generated from the rake task of the [MySystem][] Repo.

Update `wise4/mysystem2/README.md.erb` To have your changes appear here.
Otherwise *your local changes will be overwritten*.


## Current [MySystem][] ( [0cc30c0][] ) Version fronzen into [This repository][]

    MySystem Git Sha :   0cc30c0f10d6532c30a2df9b62fc904bc509e8a5
    Git commit time  :   Wed Jan 9 17:42:25 2013 -0500
    Git Branch / refs:   (HEAD, origin/master, origin/HEAD, master)
    Build Time       :   2013-01-09 17:54:21 -0500
    SproutCore Build :   90a0439bb6846e57b4eeaa8bfefcb628db75ec64

[0cc30c0]: https://github.com/concord-consortium/mysystem_sc/commits/0cc30c0f10d6532c30a2df9b62fc904bc509e8a5
[This repository]: https://github.com/concord-consortium/MySystem-Wise-Integration-WIP
[WISE4]: http://wise4.org
[MySystem]: https://github.com/concord-consortium/mysystem_sc
[rvm]: http://beginrescueend.com

