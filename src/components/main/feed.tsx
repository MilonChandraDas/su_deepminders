"use client";
import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { BellDot, House, LogOut, Settings, Share2, ShieldCheck, User, User2 } from "lucide-react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import CreatePostModal from "../modal/createPost";
import { crimeReportsApi, type PaginatedResponse } from "@/lib/api-client";
import { CrimeReport } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const [votes, setVotes] = useState(0);
  const [votesDown, setVotesDown] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await crimeReportsApi.list();
        setReports(response.data.data);
      } catch (err) {
        setError("Failed to load crime reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleVote = useCallback(async (reportId: number, value: 1 | -1) => {
    try {
      await crimeReportsApi.vote(reportId, { value });

      // Optimistically update the reports state
      setReports((prevReports) =>
        prevReports.map((report) => {
          if (report.id === reportId) {
            // Assuming _count exists in the report object
            return {
              ...report,
              _count: {
                ...report._count,
                votes: (report._count?.votes || 0) + value,
              },
            };
          }
          return report;
        })
      );
    } catch (error) {
      alert("Failed to vote. Please try again.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-2">
      {/* Navbar */}
      <nav className="flex bg-white p-4 text-center rounded shadow">
        <div className="flex justify-center w-full gap-8">
          <button className="flex items-center justify-center text-lg font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-blue-600">
            <House className="w-6 h-6" />
          </button>
          <button className="flex items-center justify-center text-lg font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-blue-600">
            <User2 className="w-6 h-6" />
          </button>
          <button className="flex items-center justify-center text-lg font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-blue-600">
            <Settings className="w-6 h-6" />
          </button>
          <button className="flex items-center justify-center text-lg font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-blue-600">
            <BellDot className="w-6 h-6" />
          </button>
          <button className="flex items-center justify-center text-lg font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-blue-600">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <Card className="p-4 mt-2 bg-white">
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image src="/bd.webp" alt="User avatar" fill className="rounded-full object-cover" />
          </div>
          <div className="flex-grow">
            <Input
              placeholder="What on you see?"
              className="bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-full mb-2"
              onClick={() => setModalOpen(true)}
              readOnly
            />
          </div>
        </div>
      </Card>

      <CreatePostModal open={modalOpen} setOpen={setModalOpen} />

      {loading ? (
        <div className="mt-6 text-center">Loading crime reports...</div>
      ) : error ? (
        <div className="mt-6 text-center text-red-500">{error}</div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="mt-6 flex justify-center">
            <Card className="w-full max-w-xl p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <Image
                      src={report.postedBy?.profilePicture || "/bd.webp"}
                      alt="User avatar"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{report.postedBy?.email}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{formatDistanceToNow(new Date(report.postTime))} ago</span>
                      <span>•</span>
                      <span>📍 {report.districtName}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                </div>
              </div>

              <div className="mt-3">
                <h2 className="text-xl font-semibold text-gray-800">{report.title}</h2>
                <p className="mt-1 text-gray-600 leading-relaxed">{report.description}</p>
              </div>

              {report.media && report.media[0] && (
                <div className="mt-4 relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <Image src={report.media[0].url} alt="Crime report image" fill className="object-cover" />
                </div>
              )}

              <div className="mt-2 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleVote(report.id, 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <ThumbsUp className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-blue-500">{report._count?.votes || 0}</span>
                    </button>

                    <button
                      onClick={() => handleVote(report.id, -1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <ThumbsDown className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group">
                      <Share2 className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <Input
                    placeholder="Write a comment..."
                    className="w-full border-0 border-b border-gray-200 focus:border-blue-500 rounded-none px-0 py-2 focus:ring-0 transition-colors"
                  />
                </div>
                <button className="mt-2 text-sm text-gray-500 hover:text-gray-700">View all comments</button>
              </div>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
