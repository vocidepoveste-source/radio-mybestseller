# Radio MyBestseller — Expo (React Native) + AAB ready

## Stream
- MP3: https://play.radioking.io/radio-mybestseller
- M3U: https://api.radioking.io/radio/766931/listen.m3u

## Comenzi
```bash
npm install
npm run start          # rulare locală
npm run build:apk      # generează APK prin EAS
npm run build:aab      # generează AAB pentru Play Store
```

## Internal testing în Play Console (rezervă package name)
1) Create app → nume „Radio MyBestseller”, limbă „Română”, tip „App”.  
2) Activează Play App Signing.  
3) Testing → Internal testing → New release → încarcă `.aab`.  
4) Adaugă testeri (email) sau listă internă.  
5) Completează minimum la App content + Privacy Policy URL (poți publica acest template ca pagină).  
6) Submit – în momentul ăsta `ro.mybestseller.radio` e fixat.

Notă: Pentru Store, Google recomandă **AAB**; APK rămâne util pentru testare rapidă.
