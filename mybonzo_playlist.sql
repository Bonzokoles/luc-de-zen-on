-- MyBonzo Official Playlist - Insert data into database
-- Execute with: wrangler d1 execute mybonzo-app-db --remote --file=mybonzo_playlist.sql

INSERT INTO music_tracks (title, artist, album, duration, url, genre, created_at) VALUES 
('White Flag', 'Dido', 'Life for Rent', 240, '/music/01 Dido - White Flag.Mp3', 'Pop', strftime('%s', 'now')),
('Personal Jesus', 'Depeche Mode', 'Violator', 356, '/music/01. Personal Jesus.mp3', 'Electronic', datetime('now')),
('Neony', 'Miuosh', 'Kontrast', 356, '/music/02 - Miuosh - Neony.mp3', 'Hip-Hop', datetime('now')),
('Nieznajomy', 'Various', 'Unknown Album', 415, '/music/03. Nieznajomy.mp3', 'Alternative', datetime('now')),
('Blizny', 'Świernalis', 'Unknown Album', 154, '/music/044._Swiernalis_-_Blizny.mp3', 'Hip-Hop', datetime('now')),
('Tora! Tora! Tora!', 'Depeche Mode', 'Sounds of the Universe', 235, '/music/08 - Depeche Mode - Tora! Tora! Tora!.mp3', 'Electronic', datetime('now')),
('The Man Who Sold The World', 'David Bowie', 'The Man Who Sold the World', 199, '/music/08 - The Man Who Sold The World.mp3', 'Rock', datetime('now')),
('Life On Mars', 'David Bowie', 'Hunky Dory', 194, '/music/bowie Life On Mars.mp3', 'Rock', datetime('now')),
('Długość dźwieku samotności', 'Daria Zawiałow & Igor Walaszek', 'Collaboration', 212, '/music/Daria Zawiałow & Igor Walaszek - Długość dźwieku samotności.mp3', 'Pop', datetime('now')),
('Jeszcze w zielone gramy', 'Daria Zawiałow', 'Helsinki', 266, '/music/Daria Zawiałow - Jeszcze w zielone gramy (Bonus Track).mp3', 'Pop', datetime('now')),
('Nikt tak pięknie', 'Gutek', 'Unknown Album', 121, '/music/gutek - nikt tak pieknie.mp3', 'Alternative', datetime('now')),
('Kilka westchnień', 'Various', 'Unknown Album', 322, '/music/Kilka westchnień.mp3', 'Alternative', datetime('now')),
('Silacz', 'Marcin Rozynek', 'Unknown Album', 200, '/music/Marcin Rozynek - Silacz.mp3', 'Rock', datetime('now')),
('Antistar', 'Massive Attack', 'Heligoland', 280, '/music/Massive Attack - Antistar.mp3', 'Trip-Hop', datetime('now')),
('For Whom The Bell Tolls', 'Metallica', 'Ride the Lightning', 175, '/music/Metalica-Fo Whom The Bell.MP3', 'Metal', strftime('%s', 'now'));

-- Create default MyBonzo playlist
INSERT INTO music_playlists (name, description, track_count, created_at) VALUES 
('MyBonzo Official Playlist', 'Główna playlista MyBonzo z lokalnymi plikami MP3', 15, strftime('%s', 'now'));

-- Add all tracks to the playlist (assuming playlist_id = 1)
INSERT INTO playlist_tracks (playlist_id, track_id, position, added_at) 
SELECT 1, id, ROW_NUMBER() OVER (ORDER BY id), datetime('now')
FROM music_tracks 
WHERE url LIKE '/music/%';