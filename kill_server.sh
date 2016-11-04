#!/bin/sh

port=$1

kill -9 `lsof -i :$port|tail -1|tr -s " "|cut -d " " -f2`
