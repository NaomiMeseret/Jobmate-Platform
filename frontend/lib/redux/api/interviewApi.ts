import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  GetFreeformUserChatsResponse,
  GetStructuredUserChatsResponse,
} from "./I_type";

export const interviewApi = createApi({
  reducerPath: "interviewApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // ===== FREEFORM =====
    createFreeformSession: builder.mutation({
      query: (body) => ({
        url: "/interview/freeform/session",
        method: "POST",
        body,
      }),
    }),
    sendFreeformMessage: builder.mutation({
      query: ({ chat_id, message }) => ({
        url: `/interview/freeform/${chat_id}/message`, // 👈 dynamic path
        method: "POST",
        body: { message }, // ✅ only message is sent in body
      }),
    }),

    getFreeformHistory: builder.query({
      query: (chat_id) => `/interview/freeform/${chat_id}/history`,
    }),
    getFreeformUserChats: builder.query<GetFreeformUserChatsResponse, void>({
      query: () => "/interview/freeform/user/chats",
    }),

    // ===== STRUCTURED =====
    startStructuredInterview: builder.mutation({
      query: (body) => ({
        url: "/interview/structured/start",
        method: "POST",
        body,
      }),
    }),
    answerStructuredQuestion: builder.mutation({
      query: ({ chat_id, answer }) => ({
        url: `/interview/structured/${chat_id}/answer`,
        method: "POST",
        body: { answer },
      }),
    }),
    getStructuredHistory: builder.query({
      query: (chat_id) => `/interview/structured/${chat_id}/history`,
    }),
    // resumeStructuredInterview: builder.query({
    //   query: ({ chat_id, preferred_language }) =>
    //     `/interview/structured/continue/${chat_id}`,
    // }),
    resumeStructuredInterview: builder.query({
      query: ({ chat_id }) => ({
        url: `/interview/structured/continue/${chat_id}`,
        method: "GET",
        // If preferred_language is a query param, add it here:
      }),
      transformResponse: (response) => response.data, // unwrap the data directly
    }),

    getStructuredUserChats: builder.query<GetStructuredUserChatsResponse, void>(
      {
        query: () => "/interview/structured/user/chats",
      }
    ),
  }),
});

export const {
  // freeform
  useCreateFreeformSessionMutation,
  useSendFreeformMessageMutation,
  useGetFreeformHistoryQuery,
  useGetFreeformUserChatsQuery,
  // structured
  useStartStructuredInterviewMutation,
  useAnswerStructuredQuestionMutation,
  useGetStructuredHistoryQuery,
  useResumeStructuredInterviewQuery,
  useLazyResumeStructuredInterviewQuery,
  useGetStructuredUserChatsQuery,
} = interviewApi;
