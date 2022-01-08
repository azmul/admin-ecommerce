/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Upload, Modal, message, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import * as imageApi from "./api";

interface IProps {
  maxImageNumber: number,
  uploadPreset: string,
  handleImages: (data: any) => void;
  data: any;
};

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function ImageUploader({maxImageNumber, uploadPreset, handleImages, data}: IProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isSave, setIsSave] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleCancel = () => setPreviewVisible(false);

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("form:imageJPGPNG");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("form:imageSizeValidation");
    }
    return isJpgOrPng && isLt2M;
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ fileList }: any) => {
    setFileList(fileList);
    for(let i = 0; i < fileList.length; i++) {
      if(fileList[i].originFileObj) {
        setIsSave(true);
        return;
      }
    }
    setIsSave(false);
    handleImages(fileList);
  };

  const handleRemove = async(file: any) => {
    if(!file.public_id) return;
    try { 
      message.warning("Image Deleting...");
      setLoadingSave(true);
      await imageApi.destroyImage(file.public_id);
      message.success("Image sucessfully deleted");
    } catch(e) {
      const newFileList = [...fileList];
      newFileList.push(file);
      setFileList(newFileList);
      handleImages(newFileList);
    }
    finally {
      setLoadingSave(false);
    }
  };

  const handleSave = async () => {
    for(let i = 0; i < fileList.length; i++) {
      if(fileList[i].originFileObj) {
        try { 
          setLoadingSave(true);
          const image_data: any = await getBase64(fileList[i].originFileObj);
          if(image_data) {
            const response = await imageApi.saveImage(image_data, uploadPreset);
            const newFileList = [...fileList];
            newFileList.splice(i, 1);
            newFileList.push(response);
            setFileList(newFileList);
            setIsSave(false);
            handleImages(newFileList);
          }
        } catch(e) {}
        finally {
          setLoadingSave(false);
        }
      }
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {
    setFileList(data);
  },[data])

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList && fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
      >
        {fileList && fileList?.length >= maxImageNumber ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" src={previewImage && previewImage} />
      </Modal>
      {isSave && <Button loading={loadingSave} type="primary" onClick={handleSave}>Save</Button>}
    </>
  );
}
