#!/bin/bash

function deploy {
  git subtree push --prefix dist origin gh-pages
}

$@