import type { Insertable, Updateable, Selectable } from 'kysely'
import type {
  TelegramChannels,
  ChannelStats,
  Posts,
  PostMetrics,
  ContentAiChannelCategories,
  ContentAiChannelEmbeddings,
  ContentAiChannelReports,
  ContentAiCategoryBenchmarks,
  ContentAiCatalogChannels,
  ContentAiPostFeatures,
} from './types'

// Telegram Channels
export type Channel = Selectable<TelegramChannels>
export type NewChannel = Insertable<TelegramChannels>
export type ChannelUpdate = Updateable<TelegramChannels>

// Channel Stats
export type ChannelStatsRow = Selectable<ChannelStats>
export type NewChannelStats = Insertable<ChannelStats>
export type ChannelStatsUpdate = Updateable<ChannelStats>

// Posts
export type Post = Selectable<Posts>
export type NewPost = Insertable<Posts>
export type PostUpdate = Updateable<Posts>

// Post Metrics
export type PostMetric = Selectable<PostMetrics>
export type NewPostMetric = Insertable<PostMetrics>
export type PostMetricUpdate = Updateable<PostMetrics>

// Channel Categories (Content AI)
export type ChannelCategory = Selectable<ContentAiChannelCategories>
export type NewChannelCategory = Insertable<ContentAiChannelCategories>
export type ChannelCategoryUpdate = Updateable<ContentAiChannelCategories>

// Channel Embeddings (Content AI)
export type ChannelEmbedding = Selectable<ContentAiChannelEmbeddings>
export type NewChannelEmbedding = Insertable<ContentAiChannelEmbeddings>
export type ChannelEmbeddingUpdate = Updateable<ContentAiChannelEmbeddings>

// Channel Reports (Content AI)
export type ChannelReport = Selectable<ContentAiChannelReports>
export type NewChannelReport = Insertable<ContentAiChannelReports>
export type ChannelReportUpdate = Updateable<ContentAiChannelReports>

// Category Benchmarks (Content AI)
export type CategoryBenchmark = Selectable<ContentAiCategoryBenchmarks>
export type NewCategoryBenchmark = Insertable<ContentAiCategoryBenchmarks>
export type CategoryBenchmarkUpdate = Updateable<ContentAiCategoryBenchmarks>

// Catalog Channels (Content AI)
export type CatalogChannel = Selectable<ContentAiCatalogChannels>
export type NewCatalogChannel = Insertable<ContentAiCatalogChannels>
export type CatalogChannelUpdate = Updateable<ContentAiCatalogChannels>

// Post Features (Content AI)
export type PostFeature = Selectable<ContentAiPostFeatures>
export type NewPostFeature = Insertable<ContentAiPostFeatures>
export type PostFeatureUpdate = Updateable<ContentAiPostFeatures>
