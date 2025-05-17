// Importa o decorador Injectable e a classe Logger do NestJS.
// Injectable marca uma classe como um provedor que pode ser gerenciado pelo contêiner de Injeção de Dependência (DI) do NestJS.
// Logger é usado para registrar mensagens e eventos da aplicação.
import { Injectable, Logger } from '@nestjs/common';

// O decorador @Injectable() marca a classe AppService como um provedor.
// Isso significa que o NestJS pode injetar esta classe em outros componentes (como controladores)
// e gerenciar seu ciclo de vida.
@Injectable()
export class AppService {
  // Cria uma instância privada e somente leitura do Logger.
  // O nome 'AppService.name' (que é 'AppService') é usado como o contexto do logger,
  // ajudando a identificar a origem das mensagens de log.
  private readonly logger = new Logger(AppService.name);

  // Método que retorna o status da aplicação.
  getStatus(): string {
    // Loga uma mensagem indicando que o método foi chamado.
    this.logger.log('getStatus() called');
    // Retorna uma string indicando que a aplicação ARI está em execução.
    return 'ARI is running!';
  }

  // Método projetado para simular um erro para testes com o Sentry.
  getError(): string {
    // Loga uma mensagem indicando que o método foi chamado.
    this.logger.log('getError() called');
    // Lança um novo erro com uma mensagem específica.
    // Este erro, se não tratado em outro lugar, será capturado pelo Sentry (se configurado).
    throw new Error('My first Sentry error!');
  }
}
