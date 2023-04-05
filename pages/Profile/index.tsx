import React, { useCallback, useState, useRef } from 'react'
import PageSurface from '../../components/PageSurface'
import { observer } from 'mobx-react-lite'
import userStore from '../../store/user.Store'
import messgaeStore from '../../store/messgae.Store'
import { Button, Popover, Modal, Input } from 'antd'
import { UPLOADAVATAR, UPDATENICKNAME } from '../../request/apis/user'
import { SAVEUSERINFO } from '../../utils/local'
import Cropper from 'react-cropper'
import type { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import './index.scss'
import DefaultAvatar from '../../assets/images/default-avatar.svg'
function Profile() {
  // 选择的临时头像转为blob地址进行预览
  const [tempAvatar, setTempAvatar] = useState<any>('')
  const { avatar, nickname } = userStore.userInfo
  // 开启用于裁剪选择的头像图片的对话框
  const [open, setOpen] = useState(false)
  // 经过裁剪的base64形式的图片数据
  const [cropperImg, setCropperImg] = useState('')
  // cropper组件ref
  const cropper = useRef<ReactCropperElement>(null)
  // 图片裁剪的防抖timer
  const debounceTimer = useRef<number | null>()
  // 修改昵称的防抖timer
  const debounceUpdateNicknameTimer = useRef<number | null>()
  // 保存最终将裁剪后的base64图片转为的实际formdata类型的图片数据
  const uploadImgFormData = useRef<FormData>()
  // 更新头像操作的防抖计时器
  const debounceUploadTimer = useRef<number | null>()
  // 要修改的昵称
  const [newNickname, setNewNickname] = useState('')
  // 转换选择的头像为一个本地访问路径
  const transformTempAvatar = useCallback((file: any) => {
    const reader = new FileReader()
    reader.onload = result => {
      setTempAvatar(result.target?.result)
      setOpen(true)
    }
    reader.readAsDataURL(file)
  }, [])
  // 选择头像
  const chooseAvatar = useCallback((e: any) => {
    transformTempAvatar(e.target.files[0])
  }, [])
  // 拖入头像
  const handleDrop = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    transformTempAvatar(file)
  }, [])
  // 裁剪发生改变
  const handleCrop = useCallback(() => {
    // 防抖处理
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      const result: any = cropper.current?.cropper
        .getCroppedCanvas()
        .toDataURL()
      setCropperImg(result)
    }, 500)
  }, [])
  // 确认此次的裁剪结果
  // 使用了useCallback后里面保存的是创建该函数时的state，因此不能将依赖项设置为空
  const cropperFinish = useCallback(() => {
    const mimetype = cropperImg.split(',')[0].split(':')[1].split(';')[0]
    const data = atob(cropperImg.split(',')[1])
    const ia = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i)
    }
    const blob = new Blob([ia], { type: mimetype })
    const formdata = new FormData()
    formdata.append('avatar', blob)
    uploadImgFormData.current = formdata
    setCropperImg('')
    setOpen(false)
    setTempAvatar(cropperImg)
  }, [cropperImg])
  // 更新头像
  const uploadImg = useCallback(() => {
    if (!uploadImgFormData.current) {
      return messgaeStore.call({ type: 'warning', message: '请先选择头像' })
    }
    if (debounceUploadTimer.current) {
      return messgaeStore.call({
        type: 'info',
        message: '操作频率过快,请间隔10秒'
      })
    }
    debounceUploadTimer.current = setTimeout(() => {
      clearTimeout(debounceUploadTimer.current as number)
      debounceUploadTimer.current = null
    }, 10 * 1000)
    UPLOADAVATAR(uploadImgFormData.current).then(res => {
      if (res.success) {
        messgaeStore.call({ type: 'success', message: '更新头像成功' })
        const userInfo = { ...userStore.userInfo }
        userInfo.avatar = res.url
        userStore.changeUserInfo(userInfo)
        SAVEUSERINFO(userInfo)
      }
    })
  }, [])
  // 更新昵称
  const updateNickname = useCallback(() => {
    if (!newNickname.trim()) {
      return messgaeStore.call({ type: 'warning', message: '请正确输入' })
    }
    if (debounceUpdateNicknameTimer.current) {
      return messgaeStore.call({ type: 'warning', message: '操作太快啦~' })
    }
    debounceUpdateNicknameTimer.current = setTimeout(() => {
      clearTimeout(debounceUpdateNicknameTimer.current as number)
      debounceUpdateNicknameTimer.current = null
    }, 10 * 1000)
    UPDATENICKNAME(newNickname).then(res => {
      if (res.success) {
        messgaeStore.call({ type: 'success', message: '修改昵称成功' })
        const userInfo = { ...userStore.userInfo }
        userInfo.nickname = newNickname
        userStore.changeUserInfo(userInfo)
        SAVEUSERINFO(userInfo)
        setNewNickname('')
      }
    })
  }, [newNickname])
  return (
    <div className="profile">
      <PageSurface
        surface="http:///p9.qhimg.com/t010b9871a9ded1972f.jpg"
        title="我的信息"
      />
      <div className="container">
        <p>点击下方头像选择头像或直接拖入图片文件到头像处</p>
        <div className="avatar-wrapper">
          <div className="origin-avatar" onDrop={handleDrop}>
            <Popover title="" content="选择头像">
              <input type="file" onChange={chooseAvatar} />
              <img
                style={{ display: avatar ? 'block' : 'none' }}
                src={avatar}
                alt=""
              />
              <img
                style={{ display: avatar ? 'none' : 'block' }}
                src={DefaultAvatar}
                alt=""
              />
            </Popover>
          </div>
          <span style={{ display: tempAvatar ? 'block' : 'none' }}>
            ===&gt;&gt;
          </span>
          <img
            style={{ display: tempAvatar ? 'block' : 'none' }}
            src={tempAvatar}
            alt=""
          />
        </div>
        <div className="upload-btn">
          <Button
            className="btn"
            type="primary"
            size="small"
            onClick={uploadImg}
          >
            更 新 头 像
          </Button>
        </div>
        <br />
        <div className="nickname">
          <Input
            value={newNickname}
            onInput={(e: any) => setNewNickname(e.target.value)}
            className="input-nickname"
            placeholder="取一个美好的昵称吗?"
          />
          <br />
          <br />
          <Button
            block
            className="update-btn"
            type="primary"
            size="small"
            onClick={updateNickname}
          >
            修改 (原昵称为:{userStore.userInfo.nickname})
          </Button>
        </div>
        <Modal
          open={open}
          title="裁剪头像"
          width={500}
          onCancel={cropperFinish}
          onOk={cropperFinish}
        >
          <Cropper
            src={tempAvatar}
            style={{ width: 400, height: 500 }}
            crop={handleCrop}
            ref={cropper}
          />
          <img
            className="preview"
            style={{
              display: cropperImg ? 'block' : 'none',
              borderRadius: '50%'
            }}
            width={136}
            height={136}
            src={cropperImg}
            alt=""
          />
        </Modal>
      </div>
    </div>
  )
}
export default React.memo(observer(Profile))
