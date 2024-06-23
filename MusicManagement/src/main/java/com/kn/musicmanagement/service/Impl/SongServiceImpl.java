package com.kn.musicmanagement.service.Impl;


import com.kn.musicmanagement.mapper.SongMapper;
import com.kn.musicmanagement.pojo.Song;
import com.kn.musicmanagement.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SongServiceImpl implements SongService {

    @Autowired
    private SongMapper songMapper;


    @Override
    public List<Song> getAll() {
        List<Song> songs = songMapper.getAll();
        return songs;
    }

    @Override
    public List<Song> getUnapprovedSong() {
        List<Song> songs = songMapper.getUnapprovedSong();
        return songs;
    }

    public Boolean ApprovedSong(String song_ID) {
        int flag = songMapper.ApprovedSong(song_ID);
        return flag > 0;
    }

    @Override
    public Boolean arriveSong(String song_ID) {
        int flag = songMapper.arriveSong(song_ID);
        return flag > 0;
    }

    @Override
    public Boolean banSong(String song_ID) {
        int flag = songMapper.banSong(song_ID);
        return flag > 0;
    }

    @Override
    public List<Song> getBanSong() {
        List<Song> songs = songMapper.getBanSong();
        return songs;
    }

}
