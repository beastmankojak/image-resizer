#!/bin/bash
ls *.mp4 \
  | sed -e 's/\.mp4//' \
  | xargs -d $'\n' sh -c \
    'set -x && for arg do \
     ffmpeg -y -i "$arg".mp4 -c:v libaom-av1 -crf 30 -b:v 200k -vf scale=224:-1 -map 0:v "$arg"/224.mp4 && \
     ffmpeg -y -i "$arg".mp4 -c:v libaom-av1 -crf 30 -b:v 200k -vf scale=640:-1 -map 0:v "$arg"/640.mp4 && \
     ffmpeg -y -i "$arg".mp4 -c:v libaom-av1 -crf 30 -b:v 200k -vf scale=1024:-1 -map 0:v "$arg"/1024.mp4; done' _
