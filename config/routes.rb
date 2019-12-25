# frozen_string_literal: true

Rails.application.routes.draw do
  root 'dashboard#index'
  get '/year/:year', to: 'dashboard#index'
  post '/search', to: 'application#search'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    confirmations: 'users/confirmations',
    mailer: 'users/mailer'
  }
  resources :users, only: %i[index update show] do
    collection do
      post :save
    end
  end

  resources :leaves, except: %i[destory edit] do
    collection do
      get :team
      get :requests
      post :effective_days
    end
  end

  resources :leave_types, only: %i[index] do
  end

  resources :reportings, except: %i[destroy] do
    collection do
      get :requests
    end
  end

  resources :holidays, only: %i[index update show]

  resources :roles, only: %i[index update create] do
    collection do
      get :for_form
    end
  end
  if Rails.env.production?
    get '/404', to: 'errors#not_found'
    get '/500', to: 'errors#internal_error'
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
