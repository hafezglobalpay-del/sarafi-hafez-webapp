interface ApiResponse {
  is_success: boolean;
  status: string;
  message: string;
  errors: any;
  entity: {
    user: {
      id: string;
      name: string;
      family: string;
      email: string;
      mobile: string;
      type: number;
      verified: boolean;
      verification: {
        success: boolean;
        message: string;
        verification_url: string;
        session_id: string;
        status: string;
      };
    };
    additional_data: {
      occupation: string;
      national_code: string;
      address: string;
      bank_name: string;
      bank_account_number: string;
      user_id: string;
      verification_level: string;
      is_parent_user: boolean;
    };
    token: string;
    token_type: string;
  };
}

export const useAuth = () => {
  const { $authApi, $extractErrorMessages, $showErrorToast, $showSuccessToast } = useNuxtApp();

  const auth = useState("auth", () => ({
    isLoggedIn: false,
    name: "",
    family: "",
    email: "",
    mobile: "",
    nationalId: "",
    bankName: "",
    bankAccountNumber: "",
    occupation: "",
    address: "",
    token: "",
    verified: false,
    verification: {
      success: false,
      message: "",
      verification_url: "",
      session_id: "",
      status: "",
    },
  }));

  const initializeAuth = async () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        auth.value.token = storedToken;
        await fetchUserData();
      }
    }
  };

  const fetchUserData = async () => {
    try {
      if (!auth.value.token) return false;

      const { data, error } = await $authApi.getMe();

      if (error.value) {
        console.error("Failed to fetch user data:", error.value);
        logout();
        return false;
      }

      const response = data.value as ApiResponse;

      if (response?.is_success) {
        auth.value = {
          isLoggedIn: true,
          name: response.entity.user.name,
          family: response.entity.user.family,
          email: response.entity.user.email,
          mobile: response.entity.user.mobile,
          nationalId: response.entity.additional_data?.national_code || "",
          bankName: response.entity.additional_data?.bank_name || "",
          bankAccountNumber:
            response.entity.additional_data?.bank_account_number || "",
          occupation: response.entity.additional_data?.occupation || "",
          address: response.entity.additional_data?.address || "",
          token: auth.value.token,
          verified: response.entity.user.verified,
          verification: response.entity.user.verification || {
            success: false,
            message: "",
            verification_url: "",
            session_id: "",
            status: "",
          },
        };
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return false;
    }
  };

  if (typeof window !== "undefined") {
    initializeAuth();
  }

  const login = async (credentials: any) => {
    try {
      const { data, error } = await $authApi.login(credentials);

      if (error.value) {
        console.error("Login error:", error.value);
        return {
          success: false,
          error: error.value instanceof Error ? error.value.message : "Login failed",
        };
      }

      const response = data.value as ApiResponse;

      if (response?.is_success) {
        localStorage.setItem("auth_token", response.entity.token);

        auth.value.token = response.entity.token;
        await fetchUserData();

        if ($showSuccessToast) {
          $showSuccessToast('Login successful', 'Success');
        }

        return { success: true, data: response };
      } else {
        if ($showErrorToast) {
          $showErrorToast(response, "Login failed");
        }
        return { success: false, error: response?.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      if ($showErrorToast) {
        $showErrorToast({ message: error instanceof Error ? error.message : "Unknown error" });
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const register = async (userData: any) => {
    try {
      const { data, error } = await $authApi.register(userData);

      if (error.value) {
        console.error("Registration error:", error.value);
        return {
          success: false,
          error: error.value instanceof Error ? error.value.message : "Registration failed",
        };
      }

      const response = data.value as ApiResponse;

      if (response?.is_success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", response.entity.token);
        }

        auth.value.token = response.entity.token;
        await fetchUserData();

        if ($showSuccessToast) {
          $showSuccessToast('Registration successful! Redirecting to verification...', 'Success');
        }

        if (response.entity.user.verification?.verification_url) {
          if (typeof window !== "undefined") {
            window.location.href = response.entity.user.verification.verification_url;
          }
        }

        return { success: true, data: response };
      } else {
        if ($showErrorToast) {
          $showErrorToast(response, "Registration failed");
        }
        return {
          success: false,
          error: response?.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      if ($showErrorToast) {
        $showErrorToast({ message: error instanceof Error ? error.message : "Unknown error" });
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const logout = () => {
    auth.value = {
      isLoggedIn: false,
      name: "",
      family: "",
      email: "",
      mobile: "",
      nationalId: "",
      bankName: "",
      bankAccountNumber: "",
      occupation: "",
      address: "",
      token: "",
      verified: false,
      verification: {
        success: false,
        message: "",
        verification_url: "",
        session_id: "",
        status: "",
      },
    };

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  };

  const isLoggedIn = computed(() => auth.value.isLoggedIn);
  const user = computed(() => auth.value);

  return {
    auth: readonly(auth),
    isLoggedIn,
    user,
    login,
    register,
    logout,
    fetchUserData,
  };
};
