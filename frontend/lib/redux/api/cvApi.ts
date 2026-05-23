

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";


 export const cvApi = createApi({
  reducerPath: "cvApi",
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
   uploadCV: builder.mutation({
  query: ({ rawText, file }: { rawText?: string; file?: File }) => {
    if (rawText && file) {
      throw new Error("Only one of rawText or file can be provided");
    }

    if (file) {
      // File upload requires multipart/form-data
      const formData = new FormData();
      formData.append("file", file);

      return {
        url: "/cv/",
        method: "POST",
        body: formData,
      };
    } else if (rawText) {
      // Raw text can be JSON
      return {
        url: "/cv/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { rawText },
      };
    } else {
      throw new Error("Either rawText or file must be provided");
    }
  },
}),

    analyzeCV: builder.mutation({
      query: (cvId: string) => ({
        url: `/cv/${cvId}/analyze`,
        method: "POST",
      }),
    }),

    startSession: builder.mutation<{ chat_id: string }, { cv_id?: string }>({
      query: (body) => ({
        url: "/cv/chat/session",
        method: "POST",
        body,
      }),
    }),

    sendMessage: builder.mutation<
      { id?: string; role?: string; content: string; chat_id?: string; timestamp: string },
      { chat_id: string; message: string; cv_id?: string }
    >({
      query: ({ chat_id, ...body }) => ({
        url: `/cv/chat/${chat_id}/message`,
        method: "POST",
        body,
      }),
    }),

    getUserChats: builder.query<any[], void>({
      query: () => ({
        url: "/cv/chat/user",
        method: "GET",
      }),
    }),

    getChatHistory: builder.query<any, { chat_id: string }>({
      query: ({ chat_id }) => ({
        url: `/cv/chat/${chat_id}/history`,
        method: "GET",
      }),
    }),
      getSuggestions: builder.query<any, void>({
      query: () => "/cv/suggestions",
    }),
  }),
});

export const {
  useUploadCVMutation,
  useAnalyzeCVMutation,
  useStartSessionMutation,
  useSendMessageMutation,
  useGetUserChatsQuery,
  useGetChatHistoryQuery,
  useGetSuggestionsQuery,
} = cvApi;
