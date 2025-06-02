<template>
  <div class="change-profile-img">
    <h2>프로필 사진 변경</h2>
    <div v-if="imageUrl">
      <img :src="imageUrl" alt="프로필 이미지" class="profile-img-preview" />
    </div>

    <input type="file" @change="handleFileChange" accept="image/*" />

    <div class="button-group">
      <button
        @click="submitProfileImage"
        :disabled="!selectedFile"
        class="submit-btn"
      >
        변경
      </button>
      <button @click="goToMyPage" class="cancel-btn">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const selectedFile = ref(null);
const imageUrl = ref(null);
const router = useRouter();

const goToMyPage = () => {
  router.push("/mypage");
};

// 파일 선택 시 미리보기 이미지 생성
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  selectedFile.value = file;
  imageUrl.value = URL.createObjectURL(file);
};

const submitProfileImage = async () => {
  const formData = new FormData();
  formData.append("image", selectedFile.value);

  try {
    const response = await axios.post(
      "http://localhost:8088/api/user/change-profile-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    imageUrl.value = response.data;
    alert("프로필 사진이 변경되었습니다!");
    goToMyPage();
  } catch (error) {
    let msg;
    if (error.message === "Network Error") {
      msg = "파일 크기가 너무 큽니다. 최대 1MB 이하로 업로드 해주세요.";
    } else {
      msg =
        error.response?.data?.message ||
        error.message ||
        "알 수 없는 오류가 발생했습니다.";
    }
    alert(msg);
  }
};
</script>

<style scoped>
.change-profile-img {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

input[type="file"] {
  margin-bottom: 20px;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

button {
  padding: 10px;
  width: 200px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
}

.submit-btn {
  background-color: #2699e6;
}

.submit-btn:hover {
  background-color: #2563eb;
}

.cancel-btn {
  background-color: #ccc;
}

.cancel-btn:hover {
  background-color: #999;
}

.profile-img-preview {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 20px;
}
</style>
