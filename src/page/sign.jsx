import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Row,
  Col,
} from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { MdLock, MdPerson, MdSchool } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminService from "../service/admin.service";

const { Title, Text } = Typography;

const ModernSign = () => {
  const { isLoading } = useSelector((state) => state.admin);
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    setError("");
    setSuccess("");

    const { status } = await AdminService.loginAdmin(dispatch, navigate, {
      username: values.username,
      password: values.password,
    });

    if (status === "error") {
      setError("Login yoki parol noto'g'ri kiritilgan!");
    }
    if (status === "success") {
      setSuccess("Muvaffaqiyatli kirildi! Yo'naltirilmoqda...");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        <Row gutter={0} className="shadow-2xl rounded-3xl overflow-hidden">
          {/* Left Side - Branding */}
          <Col xs={24} lg={12}>
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 h-full flex flex-col justify-center text-white"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mx-auto lg:mx-0"
                >
                  <MdSchool size={40} />
                </motion.div>

                <div>
                  <Title level={1} className="!text-white !mb-4">
                    Xush kelibsiz!
                  </Title>
                  <Text className="text-blue-100 text-lg leading-relaxed">
                    Karakalpak Davlat Universiteti admin paneliga kirish uchun
                    login va parolingizni kiriting.
                  </Text>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <Text className="text-blue-100">Tutorlarni boshqarish</Text>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <Text className="text-blue-100">
                      Statistikalarni ko'rish
                    </Text>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <Text className="text-blue-100">
                      Xarita orqali monitoring
                    </Text>
                  </div>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* Right Side - Login Form */}
          <Col xs={24} lg={12}>
            <motion.div
              variants={itemVariants}
              className="bg-white p-12 h-full flex flex-col justify-center"
            >
              <div className="max-w-sm mx-auto w-full">
                <motion.div
                  variants={itemVariants}
                  className="text-center mb-8"
                >
                  <Title level={2} className="!mb-2">
                    Tizimga kirish
                  </Title>
                  <Text className="text-gray-500">
                    Admin panelga kirish uchun ma'lumotlaringizni kiriting
                  </Text>
                </motion.div>

                {/* Error/Success Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4"
                    >
                      <Alert
                        message={error}
                        type="error"
                        closable
                        onClose={() => setError("")}
                        className="rounded-xl"
                      />
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4"
                    >
                      <Alert
                        message={success}
                        type="success"
                        className="rounded-xl"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    size="large"
                    className="space-y-4"
                  >
                    <Form.Item
                      name="username"
                      label="Login"
                      rules={[
                        { required: true, message: "Login kiritish majburiy!" },
                      ]}
                    >
                      <Input
                        prefix={<MdPerson className="text-gray-400" />}
                        placeholder="Login kiriting"
                        className="rounded-xl h-12"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Parol"
                      rules={[
                        { required: true, message: "Parol kiritish majburiy!" },
                      ]}
                    >
                      <Input.Password
                        prefix={<MdLock className="text-gray-400" />}
                        placeholder="Parol kiriting"
                        className="rounded-xl h-12"
                      />
                    </Form.Item>

                    <Form.Item className="mb-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={isLoading}
                          className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-none rounded-xl text-lg font-medium"
                        >
                          {isLoading ? "Tekshirilmoqda..." : "Kirish"}
                        </Button>
                      </motion.div>
                    </Form.Item>

                    <div className="text-center">
                      <Text className="text-gray-500 text-sm">
                        Login yoki parolni unutdingizmi?{" "}
                        <a
                          href="#"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Yordam olish
                        </a>
                      </Text>
                    </div>
                  </Form>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-8 pt-6 border-t border-gray-200 text-center"
                >
                  <Text className="text-gray-400 text-sm">
                    © 2024 Karakalpak Davlat Universiteti. Barcha huquqlar
                    himoyalangan.
                  </Text>
                </motion.div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default ModernSign;
