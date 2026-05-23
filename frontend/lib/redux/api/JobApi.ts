import { createApi } from "@reduxjs/toolkit/query/react";
import { JobCardProps } from "@/app/components/jobSearch/Jobcard";
import { baseQueryWithReauth } from "./baseQuery";

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({ 
    // 1. Get all job chats
    getAllChats: builder.query({
      query: () => ({
        url: "/jobs/chats",
        method: "GET",
      }),
    }),

    sendMsg: builder.mutation<
      { message: string; jobs: JobCardProps[]; chat_id: string },
      { message: string; chat_id?: string }
    >({
      query: ({ message, chat_id }) => ({
        url: "/jobs/chat",
        method: "POST",
        body: { message, chat_id },
      }),
    }),

    // 3. Get single chat by ID
    getChatById: builder.query({
      query: (id) => ({
        url: `/jobs/chat/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllChatsQuery, useSendMsgMutation, useGetChatByIdQuery } =
  jobApi;
