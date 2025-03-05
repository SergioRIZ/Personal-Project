import React from 'react';
import { Link } from '../Link.jsx';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/pokemon-background.svg')] p-4 bg-no-repeat bg-cover bg-center">
      <div className="bg-[linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(204,236,241,1) 0%, rgba(180,228,235,1) 0%, rgba(171,229,241,1) 0%, rgba(213,248,254,1) 2%, rgba(204,232,238,1) 100%, rgba(165,204,212,1) 100%)] rounded-xl shadow-2xl p-8 max-w-md w-full text-center opacity-90">
        <div className="flex justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="135px" height="169px" viewBox="-0.75 -0.25 134.7 169.1"><g><path fill="#763a00" d="M78.85 140.5 Q70.75 145.75 67.05 147.65 64.2 149.15 62.3 146.65 60.45 144.15 62.05 143.2 66.0 140.8 71.75 136.25 77.35 131.8 79.45 129.55 75.8 125.1 74.0 123.6 L78.0 120.6 83.75 118.95 82.65 122.4 Q83.35 122.0 87.15 120.65 L86.7 125.15 85.8 126.05 90.15 132.35 Q87.65 134.75 78.85 140.5"/><path fill="#ffe100" d="M132.75 45.0 Q132.65 60.0 133.0 67.05 124.4 68.95 112.1 73.0 97.45 77.85 89.65 82.15 L94.3 88.9 100.35 97.0 Q91.7 102.75 87.8 106.05 L97.0 116.35 86.7 125.15 87.15 120.65 Q83.35 122.0 82.65 122.4 L83.75 118.95 78.0 120.6 82.95 116.4 Q78.25 113.5 71.35 108.2 L82.05 96.0 69.5 81.4 53.75 63.75 Q100.65 33.5 133.0 24.85 132.8 33.4 132.75 45.0"/><path fill="#763a00" d="M78.0 120.45 L83.65 118.25 84.25 118.3 84.35 118.75 83.3 121.55 86.85 119.95 Q87.7 119.65 87.7 120.4 87.65 122.4 87.0 125.15 L86.0 125.9 86.5 121.45 Q85.25 121.75 82.8 122.8 81.85 123.15 82.1 122.25 L82.95 119.7 Q78.9 120.95 76.8 121.7 L78.0 120.45"/><path fill="#542400" d="M79.2 140.3 L66.95 147.25 Q70.95 144.7 78.25 138.8 L88.5 130.0 90.25 132.35 Q86.5 135.8 79.2 140.3"/><path fill="#f9be00" d="M111.7 73.2 Q99.4 77.35 88.85 81.7 94.8 77.65 109.05 71.0 124.7 63.7 132.7 61.9 L132.9 67.05 Q124.95 68.75 111.7 73.2"/><path fill="#f9be00" d="M97.6 93.55 L100.45 97.05 86.9 105.8 Q94.8 96.05 97.6 93.55"/><path fill="#f9be00" d="M96.8 116.45 L92.5 119.9 87.2 124.25 87.5 122.25 Q92.15 115.25 94.1 113.25 L96.8 116.45"/><path fill="#542400" d="M87.2 124.25 L85.2 125.75 87.5 122.25 87.2 124.25"/><path fill="#0d131a" d="M133.85 24.35 Q133.5 29.15 133.6 45.4 L133.8 67.55 133.45 68.0 Q122.7 70.3 110.2 74.55 98.45 78.6 90.8 82.45 94.0 87.3 101.3 96.95 101.6 97.3 101.2 97.55 93.3 102.75 88.95 106.15 L97.85 116.3 Q98.15 116.6 97.8 116.9 L91.2 122.35 Q87.75 125.2 86.8 126.2 L90.95 132.35 90.9 132.9 Q88.95 134.85 82.2 139.2 75.05 143.75 67.5 147.75 L66.6 147.85 Q66.45 147.55 67.15 147.15 85.2 135.95 89.15 132.3 L85.1 126.35 Q84.9 126.05 85.15 125.8 L89.35 121.75 95.6 116.35 Q90.0 109.6 86.8 106.4 86.45 106.05 86.85 105.8 92.9 100.95 99.05 96.9 92.7 88.4 88.65 82.3 88.35 81.9 88.8 81.7 96.7 77.7 108.4 73.5 121.35 68.8 132.0 66.5 131.55 59.7 131.6 45.65 131.65 31.9 132.05 26.1 115.6 30.6 92.15 42.45 70.25 53.5 55.45 64.15 62.25 71.45 83.0 95.85 83.25 96.15 83.0 96.4 L77.55 102.45 72.55 108.15 Q81.45 114.85 83.6 116.2 84.05 116.5 83.65 116.9 L75.45 123.7 Q77.8 126.05 80.35 129.5 80.6 129.8 80.35 130.05 78.55 132.2 72.65 136.6 66.85 140.9 62.5 143.35 L61.7 143.45 Q61.5 143.2 62.05 142.8 L71.35 135.85 Q76.75 131.6 78.45 129.65 75.6 125.95 73.35 124.0 73.0 123.65 73.4 123.35 L81.65 116.6 Q76.8 113.4 70.45 108.7 70.1 108.4 70.4 108.1 L80.9 96.05 66.75 79.6 52.95 64.2 Q52.65 63.85 53.0 63.55 68.0 52.45 91.85 40.6 116.35 28.4 133.35 23.9 133.95 23.75 133.85 24.35"/><path fill="#0d131a" d="M12.5 12.55 Q9.45 14.25 7.15 20.4 5.2 25.6 4.9 30.5 2.6 23.6 1.35 12.55 0.05 1.25 1.7 0.8 3.3 0.35 6.6 4.2 9.25 7.3 12.5 12.55"/><path fill="#ffe100" d="M91.25 7.85 Q92.9 10.5 92.6 17.65 92.3 23.95 90.9 28.6 87.2 32.55 82.1 36.4 76.35 40.8 72.3 42.25 76.95 46.0 79.75 50.9 81.6 54.1 83.0 58.75 85.4 66.3 83.3 74.85 81.45 82.35 77.45 86.4 68.25 95.0 53.65 96.95 41.15 98.65 29.6 95.2 24.65 93.55 20.5 89.25 15.85 84.5 14.0 78.15 12.2 72.05 13.25 65.6 14.05 60.5 16.5 55.85 13.4 52.35 9.55 43.7 6.35 36.35 5.0 31.3 5.25 23.95 7.9 18.5 9.9 14.4 12.3 12.7 16.25 18.35 20.15 28.35 24.25 38.8 24.8 45.35 31.95 38.8 42.85 36.45 52.8 34.3 60.3 36.55 65.4 28.45 75.95 19.0 85.5 10.5 91.25 7.85"/><path fill="#ffe100" d="M33.95 92.7 Q43.6 88.05 51.05 86.4 57.05 85.1 67.0 85.15 76.8 85.15 77.45 86.4 80.25 91.75 83.05 101.5 86.05 112.1 87.45 122.45 91.0 149.25 81.65 156.25 74.8 161.45 57.7 155.1 50.2 152.4 46.65 151.55 42.1 150.5 37.3 150.7 32.45 150.9 28.7 149.6 25.3 148.45 23.8 146.55 20.4 142.15 21.25 131.7 21.9 123.85 24.45 115.75 L27.3 107.65 30.1 100.1 Q30.65 98.75 32.35 95.6 L33.95 92.7"/><path fill="#ffe100" d="M33.95 92.7 Q35.55 92.15 36.45 95.7 37.4 99.45 36.1 103.5 34.7 107.8 30.75 111.9 26.85 116.0 24.45 115.75 21.8 115.8 19.25 114.95 17.0 114.15 16.9 113.45 16.9 112.4 18.0 111.6 L16.2 108.3 Q15.3 106.5 15.4 106.2 15.65 105.8 17.35 105.95 17.3 103.0 19.55 104.2 19.65 101.85 21.5 103.55 23.0 101.15 25.5 98.7 27.65 96.55 29.6 95.2 31.2 93.65 33.95 92.7"/><path fill="#0d131a" d="M91.25 7.85 Q96.45 5.15 101.9 3.4 108.65 1.25 109.75 2.9 111.15 5.0 103.45 15.0 96.35 24.15 90.55 29.1 92.35 23.55 92.6 17.9 92.85 11.95 91.25 7.85"/><path fill="black" d="M15.95 146.25 Q18.6 144.05 21.65 143.1 24.45 149.75 33.7 150.65 29.3 152.85 23.25 153.8 17.15 154.7 16.1 153.3 14.05 153.8 13.7 152.75 13.4 151.9 14.1 150.85 12.65 148.95 15.95 146.25"/><path fill="#black" d="M72.8 158.55 Q76.85 158.7 80.2 157.15 83.35 155.7 84.65 153.4 87.25 157.7 87.85 161.55 88.45 165.5 86.65 166.55 86.6 168.0 85.3 168.0 84.15 167.95 83.4 167.05 82.8 168.7 78.6 165.6 74.3 162.4 72.8 158.55"/><path fill="#b50005" d="M40.95 77.95 L44.35 75.75 Q45.35 75.0 47.35 74.4 L50.15 73.9 54.4 73.45 Q54.25 74.9 53.3 76.35 L47.8 76.65 Q44.95 77.7 44.25 79.8 L40.95 77.95"/><path fill="#e50012" d="M44.2 79.75 Q45.2 77.8 47.85 76.7 50.75 75.5 53.4 76.4 49.3 81.8 44.2 79.75"/><path fill="#f9be00" d="M17.0 112.75 Q17.8 113.35 20.6 113.4 L25.2 112.9 24.5 115.65 Q21.75 115.75 19.05 114.8 16.2 113.8 17.0 112.75"/><path fill="#f9be00" d="M47.25 98.05 Q47.2 97.35 50.7 96.8 L54.3 97.0 Q54.35 97.6 52.95 98.25 L50.75 98.9 48.6 98.8 Q47.25 98.55 47.25 98.05"/><path fill="#f9be00" d="M21.25 134.6 Q23.05 147.95 35.95 146.9 42.45 146.35 48.5 147.8 53.7 149.05 61.05 152.45 69.35 156.35 77.45 153.35 87.8 149.55 88.75 135.05 88.65 146.4 85.75 151.7 81.1 160.35 68.5 158.05 64.3 157.3 52.7 153.45 43.2 150.3 40.25 150.65 30.95 151.75 25.85 148.0 20.2 143.85 21.25 134.6"/><path fill="black" d="M17.65 145.2 Q17.9 144.85 19.75 144.15 L22.0 143.35 Q23.0 146.25 26.95 148.5 30.55 150.55 33.65 150.55 30.5 152.25 26.6 153.1 21.95 146.15 17.65 145.2"/><path fill="black" d="M76.6 163.9 L74.55 161.4 Q73.55 159.9 73.15 158.55 80.45 159.3 84.55 153.45 86.2 156.0 86.55 157.15 83.2 157.35 80.4 159.2 77.55 161.05 76.6 163.9"/><path fill="#0d131a" d="M25.15 62.8 Q27.5 62.15 29.65 63.6 31.75 65.05 32.5 67.8 33.3 70.45 32.05 72.6 30.9 74.6 28.5 75.35 26.1 76.05 23.75 74.85 21.45 73.65 20.8 71.3 20.0 68.55 21.2 66.1 22.4 63.55 25.15 62.8"/><path fill="#ffffff" d="M24.85 63.5 L27.1 63.6 Q28.15 64.1 28.55 65.15 28.95 66.3 28.55 67.35 28.1 68.45 26.9 68.9 L24.65 68.8 Q23.6 68.3 23.25 67.15 22.9 65.95 23.4 64.9 23.85 63.85 24.85 63.5"/><path fill="#0d131a" d="M60.95 51.5 Q63.75 50.6 66.4 52.1 69.15 53.6 69.75 56.65 70.3 59.2 69.0 61.55 67.75 63.9 65.4 64.7 62.65 65.65 60.15 64.35 57.75 63.1 56.9 60.6 55.9 57.5 57.2 54.85 58.4 52.3 60.95 51.5"/><path fill="#ffffff" d="M60.6 52.25 Q61.7 51.75 62.85 52.25 64.0 52.7 64.45 53.85 64.85 54.9 64.45 56.05 64.05 57.3 62.9 57.7 61.7 58.15 60.65 57.7 59.55 57.25 59.1 56.15 58.65 55.05 59.05 53.9 59.45 52.75 60.6 52.25"/><path fill="#0d131a" d="M43.9 70.65 Q43.85 70.45 44.95 70.15 L46.05 69.95 45.75 70.6 45.1 71.05 44.4 71.0 43.9 70.65"/><path fill="blue" d="M78.1 63.9 Q80.0 64.65 80.6 67.85 81.25 71.05 80.1 74.1 78.85 77.55 76.2 79.25 73.55 80.95 71.3 79.85 69.05 78.8 68.35 75.8 67.6 72.65 69.1 69.4 70.7 65.95 73.35 64.4 75.85 63.0 78.1 63.9"/><path fill="#e50012" d="M25.1 82.9 Q27.3 85.7 28.05 88.45 28.8 91.35 27.4 92.35 26.05 93.3 23.55 91.8 21.4 90.55 18.95 87.85 16.8 85.4 15.95 82.8 15.1 80.15 16.2 79.05 17.55 77.8 20.3 79.0 22.95 80.15 25.1 82.9"/><path fill="#0d131a" d="M5.15 1.95 Q11.15 7.65 16.8 18.7 23.5 31.85 25.3 44.95 L24.3 45.85 Q22.25 32.7 15.2 19.1 9.85 8.7 4.45 2.75 2.9 1.15 2.2 1.2 1.3 1.3 1.25 3.85 1.0 12.55 4.8 27.25 9.4 45.05 16.7 55.3 L16.2 56.55 Q8.25 46.3 3.45 28.6 -0.75 13.05 0.1 3.7 0.35 0.4 1.65 0.05 2.85 -0.25 5.15 1.95"/><path fill="#0d131a" d="M5.6 32.25 L4.55 29.7 Q5.0 23.65 6.95 19.05 8.85 14.5 11.95 12.1 L12.7 13.15 Q9.45 15.7 7.6 20.9 5.8 25.9 5.6 32.25"/><path fill="#0d131a" d="M93.55 25.2 Q103.85 14.45 108.4 6.5 109.85 4.0 109.3 3.25 L105.55 3.15 Q96.8 4.85 85.9 12.05 71.4 21.6 60.85 36.7 L59.7 36.35 Q70.8 20.0 85.05 10.65 95.7 3.65 105.25 2.05 109.55 1.3 110.4 2.6 111.15 3.8 109.45 7.05 104.7 15.95 94.25 26.65 82.45 38.7 72.85 42.7 L71.8 41.95 Q81.25 37.95 93.55 25.2"/><path fill="#0d131a" d="M91.6 28.0 L89.75 29.55 Q92.0 22.5 92.05 15.95 92.05 10.5 90.85 8.45 L91.85 7.75 Q93.15 10.0 93.35 15.0 93.55 21.2 91.6 28.0"/><path fill="#0d131a" d="M79.55 92.4 Q79.2 91.25 79.55 91.1 79.95 90.95 80.35 92.1 89.1 116.35 89.0 135.5 88.85 154.85 79.6 158.45 74.55 160.4 65.15 158.3 59.45 157.05 50.2 153.65 46.35 152.25 44.3 151.8 L38.1 151.35 30.25 150.85 Q25.75 149.85 22.85 146.6 19.15 142.55 21.0 129.15 22.85 115.45 29.45 100.75 29.9 99.75 30.3 99.9 30.65 100.05 30.2 101.05 24.15 115.85 22.4 128.9 20.75 141.7 24.15 145.5 26.9 148.6 30.8 149.5 L38.1 150.05 44.9 150.5 Q46.95 150.9 50.65 152.35 70.7 159.95 78.95 156.8 87.4 153.6 87.25 134.65 87.15 116.65 79.55 92.4"/><path fill="#0d131a" d="M28.8 94.95 L30.25 95.4 Q25.05 99.0 21.1 104.8 20.55 105.65 20.25 105.5 19.95 105.3 20.5 104.45 24.1 98.3 28.8 94.95"/><path fill="#0d131a" d="M37.0 78.5 Q36.55 78.2 36.75 77.95 L37.45 77.9 Q39.3 78.6 43.0 75.95 45.15 74.4 46.75 73.9 48.35 73.35 51.3 73.25 L54.65 72.75 Q56.0 72.25 56.35 71.05 56.6 70.45 56.9 70.55 57.2 70.6 57.1 71.25 56.5 74.3 51.3 74.5 L47.1 75.1 Q45.6 75.6 43.65 77.0 39.35 80.1 37.0 78.5"/><path fill="#0d131a" d="M41.5 77.55 Q45.5 80.65 48.9 79.45 50.7 78.8 52.05 77.15 53.4 75.5 53.9 73.45 L55.25 73.2 Q54.9 75.55 53.15 77.55 51.5 79.45 49.25 80.3 L44.95 80.55 Q42.6 80.05 40.4 78.3 L41.5 77.55"/><path fill="#0d131a" d="M14.1 147.4 Q16.4 144.4 21.55 142.5 L22.0 143.7 Q17.6 145.45 15.45 147.65 13.6 149.6 14.35 150.55 L13.6 151.6 Q12.0 150.15 14.1 147.4"/><path fill="#0d131a" d="M18.05 147.25 Q18.75 146.9 18.9 147.25 19.1 147.55 18.4 147.95 16.7 148.95 15.45 150.35 14.1 151.8 14.4 152.55 L16.1 152.7 16.55 153.8 14.5 154.0 Q13.3 153.85 13.05 153.15 12.55 151.8 14.4 149.85 16.05 148.1 18.05 147.25"/><path fill="#0d131a" d="M32.95 150.5 L35.0 150.8 Q29.45 153.55 22.55 154.5 15.75 155.4 15.2 153.55 14.9 152.6 16.45 151.15 18.1 149.55 20.3 149.0 21.0 148.85 21.1 149.15 21.2 149.5 20.55 149.75 18.9 150.4 17.7 151.4 16.55 152.4 16.7 153.0 16.9 153.85 21.7 153.4 27.3 152.85 32.95 150.5"/><path fill="#0d131a" d="M72.1 158.5 L73.55 158.4 Q74.9 162.05 78.55 164.9 81.8 167.45 82.75 166.9 83.2 166.6 82.6 164.95 82.05 163.3 80.85 161.35 80.5 160.85 80.8 160.65 81.05 160.5 81.45 160.95 83.0 162.8 83.65 165.15 84.3 167.6 83.35 168.1 81.9 168.85 78.0 165.95 73.65 162.7 72.1 158.5"/><path fill="#0d131a" d="M84.55 160.3 Q84.25 159.6 84.6 159.45 84.9 159.3 85.25 159.95 87.0 163.25 87.1 165.8 87.15 168.0 86.05 168.45 L84.7 168.5 Q83.8 168.3 83.1 167.55 L83.6 166.45 Q84.85 167.7 85.6 167.35 86.2 167.05 86.0 165.25 85.75 163.25 84.55 160.3"/><path fill="#0d131a" d="M84.15 153.9 L85.05 152.8 Q87.8 157.35 88.4 161.7 89.0 166.45 86.45 167.55 L86.6 166.15 Q87.85 164.95 87.1 161.25 86.35 157.65 84.15 153.9"/><path fill="#0d131a" d="M53.5 75.85 L53.05 76.75 Q50.85 76.05 48.2 77.05 45.55 78.05 44.7 79.9 L43.7 79.6 Q44.75 77.35 47.65 76.2 50.55 75.05 53.5 75.85"/><path fill="#0d131a" d="M17.6 53.15 Q18.15 52.35 18.5 52.55 18.85 52.8 18.35 53.6 14.95 59.4 14.05 65.6 13.15 71.85 14.85 78.0 16.7 84.7 21.5 89.3 26.25 93.8 33.25 95.75 34.6 96.15 34.5 96.5 L33.05 96.65 Q25.85 95.25 20.4 90.3 14.95 85.35 13.05 78.45 11.3 72.15 12.5 65.45 13.7 58.7 17.6 53.15"/><path fill="#0d131a" d="M50.35 35.0 Q57.1 34.8 62.45 36.8 63.35 37.15 63.25 37.5 L62.2 37.6 Q50.6 34.4 37.6 38.9 29.35 41.7 23.7 47.0 23.0 47.65 22.75 47.4 22.45 47.1 23.1 46.4 28.4 40.4 37.1 37.4 43.75 35.15 50.35 35.0"/><path fill="#0d131a" d="M83.2 56.3 Q85.65 63.25 84.6 71.5 83.4 80.85 78.0 86.5 77.35 87.2 77.1 86.95 76.8 86.7 77.35 85.95 82.05 79.8 83.05 71.15 83.95 63.35 81.6 56.8 78.15 46.95 70.2 41.35 69.35 40.75 69.6 40.45 69.8 40.15 70.7 40.65 74.9 43.1 78.2 47.2 81.45 51.3 83.2 56.3"/><path fill="#0d131a" d="M21.65 103.1 L21.05 103.85 Q20.45 103.4 20.2 103.5 L20.0 104.1 19.7 104.75 18.95 104.55 18.2 104.4 Q17.85 104.55 17.8 105.4 L17.6 106.35 16.7 106.35 15.95 106.5 Q15.75 106.8 17.1 109.15 L18.5 111.6 17.95 112.3 Q17.35 112.9 17.4 113.3 17.5 113.9 20.25 114.55 L24.55 115.0 24.3 116.2 Q22.15 116.4 19.25 115.4 16.35 114.45 16.15 113.5 16.0 112.6 17.35 111.55 14.5 106.8 14.85 105.95 15.0 105.6 15.75 105.5 L17.0 105.6 Q16.9 104.95 17.1 104.3 17.25 103.65 17.6 103.45 L18.35 103.35 Q18.85 103.45 19.2 103.7 19.3 102.55 19.9 102.4 L20.75 102.55 21.65 103.1"/><path fill="#ffe100" d="M94.05 98.6 Q88.8 105.25 81.2 107.9 75.95 109.7 69.45 103.55 62.9 97.35 66.05 92.95 69.25 88.5 74.75 84.15 81.15 79.05 86.8 77.5 88.85 74.25 89.45 74.1 L90.9 74.4 Q91.95 74.9 92.75 76.15 95.4 76.5 97.2 78.6 99.1 80.75 99.25 83.9 99.55 91.6 94.05 98.6"/><path fill="#f9be00" d="M98.7 81.3 Q101.5 88.85 94.8 97.85 88.5 106.4 81.15 107.4 87.95 104.25 93.55 95.85 99.1 87.5 98.7 81.3"/><path fill="#0d131a" d="M91.25 74.1 Q92.35 74.6 93.1 75.8 99.4 76.55 100.0 84.55 100.5 91.25 95.55 98.1 90.15 105.45 81.6 108.15 L80.55 108.05 Q80.4 107.65 81.3 107.3 89.05 104.35 94.15 97.5 99.1 90.85 98.7 84.7 98.2 78.0 93.1 76.8 92.45 76.75 92.25 76.3 91.9 75.65 91.0 75.25 L89.45 75.0 Q89.0 75.15 88.25 76.4 87.5 77.75 87.05 77.9 81.2 80.2 76.75 83.35 71.55 87.05 66.75 92.8 66.15 93.5 65.8 93.25 65.5 93.0 66.05 92.2 71.3 85.4 77.1 81.5 81.25 78.7 86.35 77.05 L87.6 75.45 Q88.5 74.0 89.25 73.85 90.2 73.6 91.25 74.1"/><path fill="#0d131a" d="M90.1 77.05 L91.0 76.9 Q91.25 77.05 90.75 77.6 90.2 78.25 90.2 78.45 90.2 78.8 90.5 79.25 L90.8 79.85 90.4 80.4 Q90.0 80.85 90.0 81.4 90.0 82.05 90.4 82.65 L90.8 83.4 90.55 84.0 Q90.25 84.5 90.3 84.9 90.35 85.3 90.9 85.9 L91.5 86.65 91.25 87.4 Q91.05 88.0 91.15 88.5 L91.95 89.2 93.3 89.65 Q93.95 89.7 93.95 90.05 L93.4 90.45 91.55 90.15 Q90.45 89.7 90.2 88.95 90.05 88.55 90.15 87.9 90.25 87.2 90.6 86.8 L89.75 86.1 Q89.35 85.6 89.3 85.1 89.1 84.2 90.0 83.4 89.05 82.6 88.9 81.55 88.8 80.45 89.9 79.7 89.25 79.2 89.25 78.35 89.2 78.0 89.5 77.6 L90.1 77.05"/><path fill="#0d131a" d="M17.6 53.15 Q18.15 52.35 18.5 52.55 18.85 52.8 18.35 53.6 14.95 59.4 14.05 65.6 13.15 71.85 14.85 78.0 16.7 84.7 21.5 89.3 26.25 93.8 33.25 95.75 34.6 96.15 34.5 96.5 L33.05 96.65 Q25.85 95.25 20.4 90.3 14.95 85.35 13.05 78.45 11.3 72.15 12.5 65.45 13.7 58.7 17.6 53.15"/></g></svg></div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to the wonderful world of Pokemon!
        </h1>
        
        <div className="space-y-4">
          <Link 
            to='/login' 
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            LOG-IN
          </Link>
          
          <Link 
            to='/register' 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            REGISTER
          </Link>
        </div>
      </div>
    </div>
  );
}