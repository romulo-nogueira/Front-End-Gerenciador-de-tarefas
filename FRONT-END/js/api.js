const API_BASE_URL = "http://127.0.0.1:8000";

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: email,
            password: password
        })
    });

    if (!response.ok){
        throw new Error("Credenciais inválidas");
    }

    const data = await response.json();

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    return data;
}

export async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("access_token");

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers
        }
    });

    if (response.status === 401) {
        logout();
        throw new Error("Sessão expirada");
    }

    return response;
}

export function logout() {
    // Remove tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Limpa qualquer outro dado sensível
    localStorage.clear();
    sessionStorage.clear();

    // Impede voltar para página protegida
    window.location.replace("index.html");
}

export async function renderizarTasks() {
        const token = localStorage.getItem("access_token");
        if(!token){
            window.location.href = "./index.html";
        }
    try {
        const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
                headers: {
        'Authorization': `Bearer ${token}`
        }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar tasks: ${response.status}`);
        }

        const data = await response.json(); // converte para JSON
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }

}

export async function criarTask(title, description, categoria, data_inicio, data_entrega) {
    const token = localStorage.getItem("access_token");

    try {
        const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                description,
                categoria,
                data_inicio,
                data_entrega
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error("Erro ao criar task:", errData);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function cadastrarUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function atualizarStatusTask(taskId, categoria) {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({ categoria })
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar status");
    }

    return await response.json();
}

// Atualizar Tarefa

export async function atualizarTask(
  id,
  title,
  description,
  categoria,
  data_inicio,
  data_entrega,
  status = "pendente",
) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        categoria,
        data_inicio,
        data_entrega,
        status,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Erro ao atualizar task:", errData);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Deletar Tarefa

export async function deletarTask(id) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Erro ao deletar task:", errData);
      return null;
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return null;
  }
}