//
//  ShareInboxConstants.swift
//  Shared between AFFiNE and ShareExtension
//

import Foundation

enum ShareInboxConstants {
  static let appGroupId = "group.app.affine.pro"
  static let workspaceModeFileName = "share-workspace-mode.json"
  static let inboxDirectoryName = "ShareInbox"
  static let attachmentsDirectoryName = "Attachments"
  static let invalidDirectoryName = "Invalid"
  static let stagingDirectoryName = "affine-share-inbox-staging"
  // Air-gapped builds do not contact the AFFiNE-hosted link-preview service.
  static let officialLinkPreviewURL = URL(
    string: "https://localhost:3010/api/worker/link-preview"
  )!
  static let maxThumbnailBytes = 256 * 1024
  static let maxShareAttachmentBytes = 64 * 1024 * 1024
  static let stagingMaxAge: TimeInterval = 24 * 60 * 60
  static let openInboxURL = URL(string: "affine://share-inbox")!

  static var stagingDirectoryURL: URL {
    FileManager.default.temporaryDirectory
      .appendingPathComponent(stagingDirectoryName, isDirectory: true)
  }
}
