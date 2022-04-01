export class PostUtls {
  public static hasMixedMimeTypes = (attachments = []) => {
    const hasImages = attachments.some(at => at.type.includes('image'));
    const hasVideo = attachments.some(at => at.type.includes('video'));
    const hasAudio = attachments.some(at => at.type.includes('audio'));
    const hasDocs = attachments.some(at => at.type.includes('application'));

    return (
      (hasImages && hasVideo) ||
      (hasImages && hasDocs) ||
      (hasImages && hasAudio) ||
      (hasVideo && hasAudio) ||
      (hasVideo && hasDocs) ||
      (hasAudio && hasDocs)
    );
  };
}