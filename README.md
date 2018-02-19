# text adventure core

[![CircleCI](https://circleci.com/gh/dshaneg/text-adventure-core.svg?style=svg)](https://circleci.com/gh/dshaneg/text-adventure-core)
[![Coverage Status](https://coveralls.io/repos/github/dshaneg/text-adventure-core/badge.svg?branch=master)](https://coveralls.io/github/dshaneg/text-adventure-core?branch=master)

     _____         _
    |_   _|____  _| |_
      | |/ _ \ \/ / __|
      | |  __/>  <| |_
      |_|\___/_/\_\\__|
              _       _                 _
             / \   __| |_   _____ _ __ | |_ _   _ _ __ ___
            / _ \ / _` \ \ / / _ \ '_ \| __| | | | '__/ _ \
           / ___ \ (_| |\ V /  __/ | | | |_| |_| | | |  __/
          /_/   \_\__,_| \_/ \___|_| |_|\__|\__,_|_|  \___|

This project represents an exercise in learning. When completed, this will be a game engine for a
text-based adventure game. No fancy graphics--not even procedurally generated
maps. All game configuration is to be set up in json files.

## status

I'm tracking a very simple backlog on
[a Trello board](https://trello.com/b/AayYDKae/text-adventure). Feel free to vote for a feature.

Currently, travelling around the map is supported, so feel free to give it a try or fork the repo
and build your own adventure--just change up the json files in the game folder.

I'm sure most if not all of what I do will be very naive when it comes to building games.
I have purposefully avoided looking into code and conversations about the genre
(that dates back to the 70's or 80's at the latest), so I'm sure I'll make mistakes that
real game devs will chuckle about. That said, I'm finding that I'm enjoying building this
crappy game more than I enjoy playing triple-A titles. The goal here is to learn,
and the best way to learn is by trying and failing and trying again.

## try it out

If you just wanna try out what's working so far, head over to [dockerhub](https://hub.docker.com/r/dshaneg/text-adventure/), or just run the image with

```sh
docker run --rm -it dshaneg/text-adventure
```

That project uses this package.

## setup

To get started, hit the command shell with...

```shell
yarn
```

...to get things set up and then...

```shell
yarn tsc
```

...to transpile to javascript, and finally

```shell
yarn smoke (doesn't require the transpile step)
```

...to run the smoke test, which just runs through some commands and prints the resulting events to standard out.

## development environment

I'm using Visual Studio Code as my editor, so you'll notice some VSC-specific files sprinkled in. Also, I'm using a fair amount of ES6 syntax, so check your node version if you run into problems.

I've also converted the application to TypeScript. Like I said earlier, this application is for me to learn on.

I've recently added this project to [circleci](https://circleci.com/gh/dshaneg/text-adventure-core), so I also have a docker container that can be used as the development/build environment. If you're on a windows box, you can start it up using

```ps1
bin/dev
```

From there, you can use the makefile to do all the things. `build` is the default rule.

## design

### attempt 1

The original idea was to make the game engine an EventEmitter and the client(text-engine) would respond to events and submit commands via parsers.
Command handlers would respond to commands, updating the game state and raising events using the game engine.

### attempt 2

The next thought was that I'd use the Postal npm package, which provides an in-memory message bus. Now I can decouple all the things. The game state objects, as well as the client(text-engine) respond to events published by the command handlers. Everyone knows about the message bus but nothing else.

The contracts of the application came down to commands, queries, and events, which were each published in a different postal channel.

### current

Then I had the bright idea that I want to serve this thing from a web api, which meant that the beautiful message bus wan't gonna cut it, and I needed to separate the game engine from the UI. The lines are a little blurry since the game is all text, but the third iteration of the architecture has the core game logic in this npm package and it requires a driver/UI layer to actually play the game.

The game engine mostly just accepts text input and spits out events. Many things can (and must) be injected by the driver application, though this package provides default implementations for everything that is needed so far. See the [smoke test](test/smoke.ts) for an example of how to compose the driver application, or see the [command line client](https://hub.docker.com/r/dshaneg/text-adventure/) for a fuller example.