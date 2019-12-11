# frozen_string_literal: true

Rails.application.routes.draw do
  root 'dashboard#index'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    confirmations: 'users/confirmations',
    mailer: 'users/mailer'
  }
  resources :users, only: [:index]
  if Rails.env.production?
    get '/404', to: 'errors#not_found'
    get '/500', to: 'errors#internal_error'
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
