"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CCardBody,
  CForm,
  CFormInput,
  CButton,
} from "@coreui/react";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  videoUrl: string;
};

const NewsVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(""); // 📅 filter tanggal
  const videosPerPage = 6;

 useEffect(() => {
  const apiKey = "AIzaSyBY03UjytVHsry_VLpdF6-D1oYSjWEQrW0";
  const channelId = "UCr_H2QYUqL9VCKrSzpwyReQ";

  const fetchVideos = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20`
      );

      const json = await res.json();

      if (!res.ok) {
        console.error("YouTube API error:", json);
        throw new Error(json.error?.message || "Failed to fetch videos");
      }

      const items = (json.items as any[])
        ?.filter((item) => item.id?.videoId)
        ?.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        }));

      setVideos(items);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil video YouTube. Coba cek API key-mu.");
    }
  };

  fetchVideos();
}, []);


  // 🧮 Filter video berdasarkan tanggal upload
  const filteredVideos = selectedDate
    ? videos.filter(
        (v) =>
          new Date(v.publishedAt).toISOString().split("T")[0] === selectedDate
      )
    : videos;

  const indexOfLast = currentPage * videosPerPage;
  const indexOfFirst = indexOfLast - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const gridMinHeight = "min-h-[1110px]";

  const handleResetFilter = () => {
    setSelectedDate("");
  };


  return (
    <div className="bg-[#80cff9] min-h-screen py-16" id="YouTube">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================== Title Section ================== */}
        <div className="flex flex-col justify-center items-center text-center px-2 sm:px-6 md:px-8">
          <div className="text-2xl sm:text-3xl md:text-4xl font-medium py-8 sm:pb-8 md:pb-12">
            #Video
          </div>
          <div className="pb-8 text-lg sm:text-xl font-medium">
            Contoh Pelaksanaan Kegiatan yml.net 
          </div>
        </div>

        {/* ================== Filter Section ================== */}
        <div className="flex flex-col items-center pb-8">
          <div className="shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#0a2e47] text-[#e1f1fd] border border-[#0a2e47] p-5 rounded-2xl">
            <div className="font-semibold text-center text-base sm:text-lg mb-3">
              📅 Filter Video Berdasarkan Tanggal Upload
            </div>

                <CCardBody>
      {/* Form Filter */}
      <CForm className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <CFormInput
          type="date"
          label="Pilih tanggal upload"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1); // reset pagination
          }}
          className="w-full sm:max-w-xs bg-[#0a2e47] text-[#e1f1fd] border-[#0a2e47] rounded-lg px-3 py-2 cursor-pointer"
        /> 

        {selectedDate && (
          <CButton
            color="light"
            variant="outline"
            className="w-full sm:w-auto text-blue-800 border-blue-800 hover:bg-blue-200 transition rounded-lg"
            onClick={handleResetFilter}
          >
            Reset
          </CButton>
        )}
      </CForm>

      {/* Info tanggal terpilih */}
      {selectedDate && (
        <p className="text-[#e1f1fd] text-sm mt-4 text-center px-2 leading-relaxed">
          Menampilkan video yang diupload pada:{" "}
          <strong>
            {new Date(selectedDate).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </strong>
        </p>
      )}
    </CCardBody>
  </div>
</div>

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* ✅ Grid Video */}
        <div className={`transition-all duration-300 ${gridMinHeight}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-8
                place-items-stretch
              "
            >
              {currentVideos.map((video) => (
                <motion.div
                  key={video.id}
                  className="bg-white/80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-video">
                    <iframe
                      src={video.videoUrl}
                      title={video.title}
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold mb-1 text-gray-900 line-clamp-3">
                      {video.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-2">
                      {new Date(video.publishedAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3 flex-1">
                      {video.description || "Tidak ada deskripsi."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================== Pagination ================== */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {!error && filteredVideos.length === 0 && (
          <p className="text-center text-gray-600 mt-6">
            Tidak ada video pada tanggal ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsVideos;
