import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// S3 Presigned URL을 이용한 파일 업로드
export const fileupload = {
  uploadImageToS3: async (file, pathPrefix = '') => {
    if (!file) return null;
    const extension = file.type.split('/').pop();
    const uniqueName = `${uuidv4()}.${extension}`;
    const encodingFileName = encodeURIComponent(uniqueName);

    // presigned url 요청
    const response = await axios.get(
      'https://jt6r1uca8l.execute-api.ap-northeast-2.amazonaws.com/default/getPresignedUrl',
      {
        params: {
          filename: pathPrefix + encodingFileName,
          contentType: file.type,
        },
      }
    );

    const { statusCode, body } = response.data;
    if (statusCode === 200) {
      const bodyData = JSON.parse(body);
      const presignedUrl = bodyData.url;

      // S3 업로드
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      return {
        filename: pathPrefix + uniqueName, // 반환 값 명확화
        originalName: file.name,
        contentType: file.type,
        url: presignedUrl.split('?')[0],
      };
    } else {
      throw new Error('Presigned url 요청 실패');
    }
  }
};