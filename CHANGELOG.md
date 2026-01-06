# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Smart Upload**: Added drag-and-drop support in the editor area to instantly replace the current image.
- **Visual Feedback**: Added an overlay with visual cues when dragging files over the editor.
- **Ad Component**: Integrated `MiaoMintAd` component for sidebar promotion.
- **I18n**: Added new translation keys for editor interactions and advertisements.

### Changed
- **UI Overhaul**: Refactored the main layout to merge the upload area into the editor workspace for a more immersive experience.
- **Responsive Design**: Optimized the split-screen layout for large screens (lg breakpoint) to ensure a full-height, scroll-free experience.
- **Preview Panel**: Updated the "Covers" tab layout to a 2x2 grid for better space utilization and visual balance.
- **Button Styling**: Enhanced cover preset buttons with text truncation to prevent layout shifts.

### Fixed
- Fixed layout alignment issues in large screen mode where the right sidebar height didn't match the editor area.
- Fixed image truncation issues within the editor by ensuring the cropper component fills the available space correctly.
