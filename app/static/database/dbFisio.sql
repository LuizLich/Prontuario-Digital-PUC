CREATE TABLE `users` (
  `users_id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `email` VARCHAR(255) UNIQUE,
  `registration` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255),
  `type_user` ENUM('admin', 'funcionario'),
  `birthday` DATE
);

CREATE TABLE `supervisor_interns` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `supervisor_id` INTEGER NOT NULL,
  `intern_id` INTEGER NOT NULL,
  UNIQUE (`supervisor_id`, `intern_id`),
  INDEX (`supervisor_id`),
  INDEX (`intern_id`),
  FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`users_id`) ON DELETE CASCADE,
  FOREIGN KEY (`intern_id`) REFERENCES `users` (`users_id`) ON DELETE CASCADE
);

CREATE TABLE `patients` (
  `patients_id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `cpf` VARCHAR(255) UNIQUE,
  `birthday` DATE,
  `number` VARCHAR(255),
  `intern_id` INTEGER,
  `supervisor_id` INTEGER,
  INDEX (`intern_id`),
  INDEX (`supervisor_id`),
  FOREIGN KEY (`intern_id`) REFERENCES `users` (`users_id`) ON DELETE SET NULL,
  FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`users_id`) ON DELETE SET NULL
);

CREATE TABLE `patients_records` (
  `records_id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `patients_id` INTEGER,
  `users_id` INTEGER,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`patients_id`),
  INDEX (`users_id`),
  FOREIGN KEY (`patients_id`) REFERENCES `patients` (`patients_id`) ON DELETE CASCADE,
  FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`) ON DELETE SET NULL
);

CREATE TABLE `forms` (
  `forms_id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255)
);

CREATE TABLE `forms_answers` (
  `answers_id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `records_id` INTEGER,
  `forms_id` INTEGER,
  `user_id` INTEGER,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`records_id`),
  INDEX (`forms_id`),
  INDEX (`user_id`),
  FOREIGN KEY (`records_id`) REFERENCES `patients_records` (`records_id`) ON DELETE CASCADE,
  FOREIGN KEY (`forms_id`) REFERENCES `forms` (`forms_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`users_id`) ON DELETE SET NULL
);

CREATE TABLE `forms_questions` (
  `questions_id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `text` TEXT,
  `type_of_answer` ENUM(
    'texto',
    'texto_longo',
    'numero',
    'booleano',
    'multipla_escolha',
    'opcao_unica',
    'data',
    'hora',
    'escala',
    'arquivo'
  )
);

CREATE TABLE `form_question_map` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `forms_id` INTEGER NOT NULL,
  `questions_id` INTEGER NOT NULL,
  `question_order` INTEGER NOT NULL,
  INDEX (`forms_id`),
  INDEX (`questions_id`),
  FOREIGN KEY (`forms_id`) REFERENCES `forms` (`forms_id`) ON DELETE CASCADE,
  FOREIGN KEY (`questions_id`) REFERENCES `forms_questions` (`questions_id`) ON DELETE CASCADE
);

CREATE TABLE `forms_question_answers` (
  `question_answer_id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `answers_id` INTEGER,
  `questions_id` INTEGER,
  `answer_text` TEXT,
  INDEX (`answers_id`),
  INDEX (`questions_id`),
  FOREIGN KEY (`answers_id`) REFERENCES `forms_answers` (`answers_id`) ON DELETE CASCADE,
  FOREIGN KEY (`questions_id`) REFERENCES `forms_questions` (`questions_id`) ON DELETE CASCADE
);