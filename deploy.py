
import os
import subprocess
import sys
import shutil
import getpass

def print_color(text, color_code):
    print(f"\033[{color_code}m{text}\033[0m")

def run_command(command, shell=True):
    try:
        subprocess.run(command, shell=shell, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print_color(f"Erro ao executar: {command}", "31")
        return False

def setup():
    print_color("==============================================", "34")
    print_color("   ThreatOne | Python Deployment System       ", "34")
    print_color("==============================================", "34")

    # 1. Verificar dependências
    deps = ["docker", "docker-compose", "mysql"]
    for dep in deps:
        if not shutil.which(dep):
            if dep == "docker-compose":
                # Tenta checkar o plugin docker compose
                res = subprocess.run(["docker", "compose", "version"], capture_output=True)
                if res.returncode != 0:
                    print_color(f"Aviso: {dep} não encontrado. Por favor instale-o.", "33")
            else:
                print_color(f"Erro: {dep} não está instalado no seu sistema.", "31")
                sys.exit(1)

    # 2. Configurar .env
    if not os.path.exists(".env"):
        print_color("[1/4] Configurando arquivo .env...", "33")
        api_key = input("Insira sua Gemini API Key: ")
        db_user = input("Usuário MySQL (padrão: root): ") or "root"
        db_pass = getpass.getpass("Senha do MySQL: ")
        db_name = "sdkcti"
        
        # Tenta pegar o IP do host para o container
        try:
            host_ip = subprocess.check_output("ip -4 addr show docker0 | grep -oP '(?<=inet\\s)\\d+(\\.\\d+){3}'", shell=True).decode().strip()
        except:
            host_ip = "host.docker.internal"

        with open(".env", "w") as f:
            f.write(f"API_KEY={api_key}\n")
            f.write(f"DB_HOST={host_ip}\n")
            f.write(f"DB_USER={db_user}\n")
            f.write(f"DB_PASS={db_pass}\n")
            f.write(f"DB_NAME={db_name}\n")
        print_color("Arquivo .env gerado com sucesso.", "32")
    else:
        print_color("[1/4] Arquivo .env já existe. Pulando.", "34")

    # 3. Inicializar Banco de Dados
    print_color("[2/4] Sincronizando banco de dados local...", "33")
    from dotenv import load_dotenv
    load_dotenv()
    
    db_user = os.getenv("DB_USER")
    db_pass = os.getenv("DB_PASS")
    db_name = os.getenv("DB_NAME")

    # Comando para criar DB e rodar init.sql
    create_db = f'mysql -u {db_user} -p"{db_pass}" -e "CREATE DATABASE IF NOT EXISTS {db_name};"'
    import_sql = f'mysql -u {db_user} -p"{db_pass}" {db_name} < init.sql'
    
    if run_command(create_db) and run_command(import_sql):
        print_color("MySQL configurado com sucesso.", "32")
    else:
        print_color("Falha ao configurar MySQL. Verifique se o serviço está rodando e se a senha está correta.", "31")
        sys.exit(1)

    # 4. Build e Up
    print_color("[3/4] Iniciando containers via Docker Compose...", "33")
    if run_command("docker compose up --build -d"):
        print_color("Plataforma ThreatOne está subindo!", "32")
    else:
        print_color("Falha ao iniciar containers.", "31")
        sys.exit(1)

    print_color("==============================================", "34")
    print_color("   INSTALAÇÃO CONCLUÍDA!                      ", "32")
    print_color("   Acesse: http://localhost:5173              ", "32")
    print_color("==============================================", "34")

if __name__ == "__main__":
    setup()
